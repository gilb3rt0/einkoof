import bcrypt from 'bcrypt';

const saltRounds = 12;

export const generateHash = async (password: string): Promise<string> => {
	return bcrypt.hash(password, saltRounds);
};

export const compareHash = async (password: string, hash: string): Promise<boolean> => {
	return bcrypt.compare(password, hash);
};
