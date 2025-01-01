<script lang="ts">
	// import { ArrowRight } from 'lucide-svelte';
	interface LinkProps {
		href: string;
		text: string;
		target?: HTMLAnchorElement['target'];
	}
	const { href, text, target }: LinkProps = $props();
</script>

<a
	{href}
	{target}
	class="flex w-min flex-grow-0 items-center gap-2 whitespace-nowrap rounded-lg bg-cyan-200 px-4 py-2 text-slate-800"
>
	{text}
	<!-- <ArrowRight /> -->
</a>
