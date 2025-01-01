<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		error,
		disabled,
		value = $bindable(),
		className,
		...rest
	}: {
		error?: boolean;
		disabled?: boolean;
		className?: string;
	} & Omit<HTMLInputAttributes, 'type' | 'aria-disabled' | 'class'> = $props();
</script>

<input
	bind:value
	type="text"
	aria-disabled={!!disabled}
	class={`focus:outline-cyan-200, peer rounded-lg border-2 border-amber-100 text-slate-800 outline-2 outline-offset-2 ${error ? 'border-red-400 outline focus:border-red-400 focus:outline-red-400' : 'focus:border-cyan-800 focus:outline-cyan-800'} ${disabled ? 'bg-slate-200' : ''} ${className ?? ''}`}
	{...rest}
/>
