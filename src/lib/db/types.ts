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

export type Item = {
	title: string;
	checked?: boolean;
};

export type List = {
	id: number;
	items: Item[];
	user_id: number;
	title?: string;
	created_at: Date;
};

export type User_Lists = {
	user_id: number;
	list_id: number;
};
