import { checkSession, invalidateSession } from '$lib/db/session';
import { type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const {
		cookies,
		url: { pathname }
	} = event;
	const sessionId = cookies?.get('session_id') ?? '';
	const userId = cookies?.get('user_id') ?? '';
	const sessionValid = sessionId ? await checkSession(sessionId ?? '') : false;

	if (!sessionValid && sessionId && userId) {
		await invalidateSession(sessionId ?? '');
		cookies?.delete('session_id', { path: '/' });
		cookies?.delete('user_id', { path: '/' });
	}

	if (pathname.startsWith('/dashboard')) {
		if (!sessionValid) {
			console.log('Not logged in');
			return new Response(null, {
				status: 302,
				headers: {
					location: '/login'
				}
			});
		}
	}

	if (pathname.startsWith('/login')) {
		if (sessionValid) {
			console.log('Already logged in');
			return new Response(null, {
				status: 300,
				headers: {
					location: '/dashboard'
				}
			});
		}
	}
	const response = await resolve(event);

	return response;
};
