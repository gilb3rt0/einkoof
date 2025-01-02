<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import type { PageData } from './$types';
	import { Nav } from '$lib';
	let { children, data }: { children: Snippet; data: PageData } = $props();
	const { isLoggedIn } = data;
	const links = [
		{ href: '/', label: 'home' },
		{ href: '/dashboard', label: 'dashboard' },
		...(isLoggedIn ? [{ href: '/logout', label: 'logout' }] : [{ href: '/login', label: 'login' }])
	];
</script>

<main class="min-h-[100dvh] w-full bg-zinc-900 py-10 text-center font-mono text-yellow-100">
	<Nav {links} />
	<section class="mx-auto w-fit max-w-4xl p-2 text-left lg:p-0">
		{@render children()}
	</section>
</main>
