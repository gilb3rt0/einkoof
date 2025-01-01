<script lang="ts">
	import Nav from '$lib/components/layout/nav.svelte';
	import type { Snippet } from 'svelte';
	import '../app.css';
	import type { PageData } from './$types';
	let { children, data }: { children: Snippet; data: PageData } = $props();
	const { isLoggedIn } = data;
	const links = [
		{ href: '/', label: 'home' },
		{ href: '/dashboard', label: 'dashboard' },
		...(isLoggedIn ? [{ href: '/logout', label: 'logout' }] : [{ href: '/login', label: 'login' }])
	];
</script>

<Nav {links} />
{@render children()}
