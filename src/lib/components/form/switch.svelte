<script lang="ts">
	import { Label } from '$lib';
	import type { HTMLInputAttributes, HTMLLabelAttributes } from 'svelte/elements';

	let {
		error,
		onchange,
		label,
		...rest
	}: {
		error?: boolean;
		label: {
			text: string;
		} & HTMLLabelAttributes;
	} & Omit<HTMLInputAttributes, 'type'> = $props();
</script>

<Label for={label.for} class="inline-flex cursor-pointer items-center" {error}>
	<input type="checkbox" class="peer sr-only" {onchange} {...rest} />
	<div
		class="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-amber-100 after:transition-all after:content-[''] peer-checked:bg-cyan-700 peer-checked:after:translate-x-full peer-checked:after:border-amber-100 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-cyan-300"
	></div>
	<span class="ms-3 text-sm font-medium">{label.text}</span>
</Label>
