<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Link } from '$lib';
	import { onNavigate } from '$app/navigation';
	const { links } = $props();
	let menuOpen = $state(false);
	onNavigate(() => {
		menuOpen = false;
	});
</script>

<nav class="mb-10">
	<div class="lg:hidden">
		<button class="lg:hidden" onclick={() => (menuOpen = !menuOpen)}>
			<span class="sr-only"> toggle menu</span>
			{#if menuOpen}
				<Icon icon="mdi-close" class="size-12" />
			{:else}
				<Icon icon="mdi:hamburger-menu" class="size-12" />
			{/if}
		</button>
	</div>
	<ul
		class={`${menuOpen ? 'z-10 flex' : 'hidden'} fixed flex-col gap-2 rounded-xl border-2 border-amber-100 bg-cyan-900 p-2 transition-transform lg:relative lg:flex lg:flex-row lg:gap-4 lg:border-none lg:bg-transparent lg:transition-none`}
	>
		{#each links as { href, label }}<li>
				<Link {href} text={label}></Link>
			</li>
		{/each}
	</ul>
</nav>
