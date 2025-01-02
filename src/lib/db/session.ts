import { error } from '@sveltejs/kit';
import { psql } from './client';
import type { Session, User } from './types';

export const generateSessionId = async (userId: number): Promise<string | false> => {
	const existingSession = await psql<User[]>`SELECT session_id FROM users WHERE id = ${userId}`;

	if (existingSession.length > 0 || existingSession[0].session_id) {
		const query = await psql<
			Session[]
		>`INSERT into sessions (id, user_id,  session_expiry) VALUES (uuid_generate_v4(), ${userId}, NOW() + INTERVAL '1 day') RETURNING id`;

		if (query.length === 0) {
			console.error('Error generating session id');
			return false;
		}

		await psql`UPDATE users SET session_id = ${query[0].id} WHERE id = ${userId}`;
		return query[0].id;
	} else {
		const session = await psql<{ id: string }[]>`
            INSERT INTO sessions (id, user_id, session_expiry) VALUES (uuid_generate_v4(), ${userId}, NOW() + INTERVAL '1 day') RETURNING id`;
		if (session.length === 0) {
			error(403, '/logout');
		}
		await psql`INSERT INTO users (session_id) VALUES (${session[0].id}) WHERE id = ${userId}`;
		return session[0].id;
	}
};

export const checkSession = async (sessionId: string) => {
	const sessionNonExpired = await psql<{ id: string }[]>`
    SELECT id FROM sessions WHERE id = ${sessionId} and session_expiry > NOW()`;

	if (sessionNonExpired.length === 0) {
		const expiredSession = await psql<{ user_id: number }[]>`
		SELECT user_id FROM sessions WHERE id = ${sessionId}`;

		if (expiredSession.length > 0) {
			await psql`UPDATE users SET session_id = NULL WHERE id = ${expiredSession[0].user_id}`;
		}
		return false;
	}

	return true;
};

export const renewSession = async (sessionId: string) => {
	try {
		await psql`UPDATE sessions SET session_expiry = NOW() + INTERVAL '1 day' WHERE id = ${sessionId}`;
	} catch {
		console.error('Session not found');
	}
};

export const cookieOptions = {
	secure: true,
	httpOnly: true,
	path: '/'
};
