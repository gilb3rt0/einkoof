<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		checked = $bindable(false),
		error,
		disabled,
		...rest
	}: {
		checked?: boolean;
		error?: boolean;
		disabled?: boolean;
	} & Omit<HTMLInputAttributes, 'type' | 'aria-disabled' | 'class' | 'checked'> = $props();
</script>

<input
	bind:checked
	class={`peer rounded-md border-2 border-amber-100 p-3 text-cyan-800 outline-offset-2 ${error ? 'border-red-400 outline-red-400 focus:border-red-400 focus:outline-red-400' : 'focus:border-cyan-800 focus:outline-cyan-800'} ${
		disabled ? 'text-slate-200' : ''
	}`}
	type="checkbox"
	{...rest}
/>
