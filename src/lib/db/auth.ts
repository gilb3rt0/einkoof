import { psql } from './client';

export const logoutQuery = async (session_id: string) => {
	try {
		await psql`
		UPDATE userS
		SET session_id = NULL
		WHERE session_id = ${session_id};
		`;
	} catch (error) {
		console.error(error);
		return false;
	}
	try {
		await psql`
        DELETE FROM sessions
        WHERE id = ${session_id};
    `;
	} catch (error) {
		console.error(error);
		return false;
	}
	return true;
};
