import { psql } from '$lib/db/client';
import { compareHash, generateHash } from '$lib/db/crypt';
import { cookieOptions, generateSessionId } from '$lib/db/session';
import type { User } from '$lib/db/types';
import { fail, redirect, type Load } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { Actions } from './$types';

export const load: Load = async ({ params: { page } }) => {
	const form = await superValidate(zod(registrationSchema));
	return { page, form };
};

const hasNumber = /\d/;
const hasUpperCase = /[A-Z]/;
const hasLowerCase = /[a-z]/;
const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;
const loginSchema = z.object({
	email: z
		.string({
			required_error: 'Email is required'
		})
		.trim()
		.min(1, 'Email is required')
		.email('Please enter a valid email address'),
	password: z
		.string()
		.min(1, 'Password is required')
		.min(8, 'Password must be at least 8 characters long')
});

const registrationSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
	username: z
		.string()
		.trim()
		.min(1, 'Username is required')
		.min(3, 'Username must be at least 3 characters long'),
	password: z
		.string()
		.trim()
		.min(1, 'Password is required')
		.min(8, 'Password must be at least 8 characters long')
		.refine((value) => hasNumber.test(value ?? ''), 'password must contain at least one number')
		.refine(
			(value) => hasUpperCase.test(value ?? ''),
			'password must contain at least one uppercase letter'
		)
		.refine(
			(value) => hasLowerCase.test(value ?? ''),
			'password must contain at least one lowercase letter'
		)
		.refine(
			(value) => hasSpecial.test(value ?? ''),
			'password must contain at least one special character'
		)
});

export const actions = {
	login: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(loginSchema));
		const { email, password } = form.data;

		if (!form.valid) {
			return { form };
		}

		try {
			const user = await psql<User[]>`
			SELECT * FROM users
			WHERE
			email = ${email}`;

			if (user.length === 0) {
				setError(form, 'email', 'Invalid email or password');
				setError(form, 'password', 'Invalid email or password');
				return { form };
			}

			const checkPasswordResult = await compareHash(password, user[0].password);

			if (!checkPasswordResult) {
				setError(form, 'email', 'Invalid email or password');
				setError(form, 'password', 'Invalid email or password');
				return { form };
			}
			try {
				const sessionId = await generateSessionId(user[0].id);
				if (!sessionId) {
					return {
						form,
						message: 'An error occurred'
					};
				}

				cookies.set('session_id', sessionId as string, {
					path: '/',
					secure: true,
					httpOnly: true
				});
				cookies.set('user_id', String(user[0].id), {
					path: '/',
					secure: true,
					httpOnly: true
				});
			} catch (error) {
				console.error(error);
			}
		} catch {
			console.error('user not found');
			setError(form, 'email', 'Invalid email or password');
			setError(form, 'password', 'Invalid email or password');
			return { form };
		}
		redirect(307, '/dashboard');
	},
	register: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(registrationSchema));
		const { email, username, password } = form.data;

		if (!form.valid) {
			return { form };
		}
		const hashedPassword = await generateHash(password);
		try {
			await psql`INSERT INTO users (email, username, password, created_at) values (${email}, ${username}, ${hashedPassword}, NOW())`;
		} catch {
			return fail(400, {
				message: 'An error occurred'
			});
		}
		try {
			const user = await psql<User[]>`
			SELECT * FROM users
			WHERE 
			email = ${email}`;
			const sessionId = await generateSessionId(user[0].id);
			if (!sessionId) {
				return {
					form,
					message: 'An error occurred'
				};
			}

			cookies.set('session_id', sessionId as string, cookieOptions);
			cookies.set('user_id', String(user[0].id), cookieOptions);
		} catch (error) {
			console.error(error);
		}
		redirect(302, '/dashboard');
	}
} satisfies Actions;
