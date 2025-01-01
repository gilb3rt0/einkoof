import {
	POSTGRES_DB,
	POSTGRES_HOST,
	POSTGRES_PASSWORD,
	POSTGRES_PORT,
	POSTGRES_USER
} from '$env/static/private';

import postgres from 'postgres';

export const psql = postgres({
	database: POSTGRES_DB,
	host: POSTGRES_HOST,
	password: POSTGRES_PASSWORD,
	port: Number(POSTGRES_PORT),
	user: POSTGRES_USER
});
