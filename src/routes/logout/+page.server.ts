import { logoutQuery } from '$lib/db/auth';
import { cookieOptions } from '$lib/db/session';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const sessionId = cookies.get('session_id');
	const userId = cookies.get('user_id');
	if (sessionId) {
		await logoutQuery(sessionId ?? '');
		cookies.delete('session_id', cookieOptions);
		if (userId) cookies.delete('user_id', cookieOptions);
	}
};
