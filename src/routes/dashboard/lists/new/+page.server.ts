import { psql } from '$lib/db/client';
import type { User } from '$lib/db/types';
import { listSchema } from '$lib/schemas';
import { redirect, type Load } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';

export const load: Load = async ({ params: { page } }) => {
	const form = await superValidate(zod(listSchema), {
		defaults: {
			items: [
				{
					title: '',
					checked: false
				}
			]
		}
	});
	return {
		page,
		form
	};
};

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(listSchema));
		const { items, title } = form.data;
		const session_id = cookies.get('session_id');
		if (!form.valid) {
			return { form };
		}
		let param: number;

		const user = await psql<
			User[]
		>`SELECT * FROM "users" WHERE "session_id" = ${session_id as string}`;

		if (user.length === 0) {
			return { form };
		}

		try {
			const list_id = await psql`INSERT INTO "lists" (items, user_id, title) 
				VALUES (${JSON.stringify(items)}, 
				${user[0].id}, 
				COALESCE(${title as string}, NULL)) RETURNING id`;
			if (list_id.length === 0) {
				return { form };
			}

			await psql`INSERT INTO user_lists (user_id, list_id) VALUES (${user[0].id}, ${list_id[0].id})`;
			param = list_id[0].id;
		} catch (error) {
			console.error(error);

			return { form };
		}
		redirect(301, `/dashboard/lists/${param}`);
	}
} satisfies Actions;
