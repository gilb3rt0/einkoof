import { error } from '@sveltejs/kit';
import { psql } from './client';
import type { Session, User } from './types';

export const generateSessionId = async (userId: number): Promise<string | false> => {
	const existingSession = await psql<
		User[]
	>`SELECT session_id FROM public."user" WHERE id = ${userId}`;

	if (existingSession.length > 0 || existingSession[0].session_id) {
		const query = await psql<
			Session[]
		>`INSERT into public."session" (id, user_id,  session_expiry) VALUES (uuid_generate_v4(), ${userId}, NOW() + INTERVAL '1 day') RETURNING id`;

		if (query.length === 0) {
			console.error('Error generating session id');
			return false;
		}

		await psql`UPDATE public."user" SET session_id = ${query[0].id} WHERE id = ${userId}`;
		return query[0].id;
	} else {
		const session = await psql<{ id: string }[]>`
            INSERT INTO public."session" (id, user_id, session_expiry) VALUES (uuid_generate_v4(), ${userId}, NOW() + INTERVAL '1 day') RETURNING id`;
		if (session.length === 0) {
			error(403, '/logout');
		}
		await psql`INSERT INTO public."user" (session_id) VALUES (${session[0].id}) WHERE id = ${userId}`;
		return session[0].id;
	}
};

export const checkSession = async (sessionId: string) => {
	const sessionNonExpired = await psql<{ id: string }[]>`
    SELECT id FROM public."session" WHERE id = ${sessionId} and session_expiry > NOW()`;

	if (sessionNonExpired.length === 0) {
		const expiredSession = await psql<{ user_id: number }[]>`
		SELECT user_id FROM public."session" WHERE id = ${sessionId}`;

		if (expiredSession.length > 0) {
			await psql`UPDATE public."user" SET session_id = NULL WHERE id = ${expiredSession[0].user_id}`;
		}
		return false;
	}

	return true;
};

export const invalidateSession = async (sessionId: string) => {
	try {
		await psql`DELETE FROM public."session" WHERE id = ${sessionId}`;
	} catch {
		console.error('Session not found');
	}
};

export const renewSession = async (sessionId: string) => {
	try {
		await psql`UPDATE public."session" SET session_expiry = NOW() + INTERVAL '1 day' WHERE id = ${sessionId}`;
	} catch {
		console.error('Session not found');
	}
};
