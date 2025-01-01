<script lang="ts">
	import Icon from '@iconify/svelte';
	interface ButtonProps {
		onclick?: () => void;
		type?: HTMLButtonElement['type'];
		text: string;
		icon?: any;
		noIcon?: boolean;
	}
	const { onclick, type = 'button', text, icon, noIcon = false }: ButtonProps = $props();
</script>

<button
	{onclick}
	{type}
	class="flex w-min flex-grow-0 items-center gap-2 rounded-lg bg-cyan-200 px-4 py-2 text-slate-800"
>
	{text}
	{#if !noIcon}
		{#if icon}
			{icon}
		{:else}
			<Icon icon="mingcute:arrow-right-fill" />
		{/if}
	{/if}
</button>
