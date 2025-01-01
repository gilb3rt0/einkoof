<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	let passwordType: 'text' | 'password' = $state('password');
	let {
		error,
		disabled,
		value = $bindable(),
		children,
		...rest
	}: {
		error?: boolean;
		disabled?: boolean;
		value: string;
	} & Omit<HTMLInputAttributes, 'type' | 'aria-disabled'> = $props();
</script>

<input
	bind:value
	class={`form-input rounded-lg border-amber-100 text-slate-800 outline-offset-2 disabled:bg-slate-300 ${error ? 'border-2 border-red-400 focus:border-red-400 focus:outline-red-400' : 'focus:border-cyan-800 focus:outline-cyan-800 '}`}
	type={passwordType}
	aria-disabled={disabled}
	{...rest}
/>
<button
	class="absolute right-2 top-8 border-none text-slate-800 focus:outline-cyan-800"
	type="button"
	onclick={() => (passwordType = passwordType === 'password' ? 'text' : 'password')}
>
	<span class="sr-only">
		{passwordType === 'password' ? 'show' : 'hide'}
		password</span
	>
	{#if passwordType === 'password'}
		<Icon icon="mdi:eye-outline" aria-hidden class="size-7" />
	{:else}
		<Icon icon="mdi:eye-off-outline" aria-hidden class="size-7" />
	{/if}
</button>
