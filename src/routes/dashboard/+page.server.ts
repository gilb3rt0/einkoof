import { psql } from '$lib/db/client';
import type { List, User, User_Lists } from '$lib/db/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const session_id = cookies.get('session_id');
	try {
		const user_id = await psql<Pick<User, 'id'>[]>`
    SELECT id FROM users WHERE session_id = ${session_id as string}`;

		const user_list_ids = await psql<Pick<User_Lists, 'list_id'>[]>`
    SELECT list_id FROM user_lists WHERE user_id = ${user_id[0].id} ORDER BY list_id ASC`;

		const lists = await psql<Omit<List, 'items'>[]>`
    SELECT id, created_at, title FROM lists WHERE id = ANY(${user_list_ids.map((list) => list.list_id)}) ORDER BY id ASC`;

		return {
			lists
		};
	} catch (error) {
		console.error(error);
		return {
			lists: []
		};
	}
};
