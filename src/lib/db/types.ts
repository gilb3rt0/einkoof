export type User = {
	id: number;
	username: string;
	email: string;
	password: string;
	created_at: Date;
	session_id: string;
};

export type Session = {
	id: string;
	user_id: number;
	session_expiry: Date;
};
