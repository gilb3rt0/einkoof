import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const isLoggedIn = !!cookies?.get('session_id');

	return {
		isLoggedIn
	};
};
