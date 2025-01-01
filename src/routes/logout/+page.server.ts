import { invalidateSession } from '$lib/db/session';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const sessionId = cookies.get('session_id');
	const userId = cookies.get('user_id');
	if (sessionId && userId) {
		console.table({
			sessionId,
			userId
		});
		await invalidateSession(sessionId ?? '');
	}
};
