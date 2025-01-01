import type { Load } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { Actions } from './$types';

const listSchema = z.object({
	items: z
		.object({
			title: z.string().min(1, 'Item must have at least one character'),
			checked: z.boolean()
		})
		.array()
		.nonempty('List must have at least one item')
});
export const load: Load = async ({ params: { page } }) => {
	const form = await superValidate(zod(listSchema), {
		defaults: {
			items: [
				{
					title: '',
					checked: false
				}
			]
		}
	});
	return {
		page,
		form
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(listSchema));
		console.log(form.errors);
		const { items } = form.data;
		items.forEach((item) => {
			console.table(item);
		});
		if (!form.valid) {
			return { form };
		}

		try {
			// await psql`INSERT INTO public."list" (items) VALUES (${items})`;
		} catch (error) {
			console.error(error);

			return { form };
		}
	}
} satisfies Actions;
