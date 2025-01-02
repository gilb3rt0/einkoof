import { z } from 'zod';

export const listSchema = z.object({
	title: z.string().optional(),
	items: z
		.object({
			title: z.string().min(1, 'Item must have at least one character'),
			checked: z.boolean().optional()
		})
		.array()
		.nonempty('List must have at least one item')
});
