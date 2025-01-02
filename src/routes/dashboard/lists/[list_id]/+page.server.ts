import { psql } from '$lib/db/client';
import type { List, User } from '$lib/db/types';
import { listSchema } from '$lib/schemas';
import { redirect, type Actions, type Load } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: Load = async ({ params: { page }, url }) => {
	const data = await psql<
		Array<
			Omit<List, 'items'> & {
				items: string;
			}
		>
	>`SELECT * FROM "lists" WHERE "id" = ${url.pathname.split('/')[3]}`;

	if (data.length === 0) {
		console.error('List not found');
		redirect(302, '/dashboard');
	}

	const { title, items } = data[0];
	const form = await superValidate(
		data?.length > 0
			? {
					title,
					items: JSON.parse(items)
				}
			: {
					title: '',
					items: [{ title: '', checked: false }]
				},
		zod(listSchema)
	);

	return {
		page,
		form
	};
};

export const actions = {
	delete: async ({ cookies, params }) => {
		const session_id = cookies.get('session_id');

		const user_id = await psql<
			Pick<User, 'id'>[]
		>`SELECT id FROM users WHERE session_id = ${session_id as string}`;

		if (user_id.length === 0) {
			console.error('User ID is undefined');
			return;
		}

		const list_id = params.list_id;
		try {
			await psql`DELETE FROM "user_lists" WHERE "list_id" = ${list_id as string}`;
		} catch (error) {
			console.error(error);
		}
		try {
			await psql`DELETE FROM "lists" WHERE "id" = ${list_id as string}`;
		} catch (error) {
			console.error(error);
		}
		redirect(302, '/dashboard');
	},
	update: async ({ request, cookies, params }) => {
		const form = await superValidate(request, zod(listSchema));
		const { items, title } = form.data;
		const session_id = cookies.get('session_id');
		if (!form.valid) {
			return { form };
		}

		const user_id = await psql<
			Pick<User, 'id'>[]
		>`SELECT id FROM users WHERE session_id = ${session_id as string}`;

		if (user_id.length === 0) {
			console.error('User ID is undefined');
			return { form };
		}

		const list_id = params.list_id;

		if (!list_id) {
			console.error('List ID is undefined');
			return { form };
		}

		try {
			await psql`UPDATE "lists" SET "items" = ${JSON.stringify(items)}, 
			"title" = coalesce(${title as string}, NULL) 
			WHERE "id" = ${list_id as string}`;
		} catch (error) {
			console.error(error);
			return { form };
		}
	}
} satisfies Actions;
