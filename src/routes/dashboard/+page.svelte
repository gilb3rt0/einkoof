<script>
	import { EinkoofBanner, Link } from '$lib';
	import Icon from '@iconify/svelte';
	import dayjs from 'dayjs';

	let { data } = $props();
	let { lists } = data;
</script>

<h2 class="text-6xl font-bold">welcome to</h2>
<EinkoofBanner />
<Link href="/dashboard/lists/new" text="Create a new list" />
<section class="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
	{#each lists as { id, title, created_at }}
		<a
			class="flex flex-col rounded-xl border-2 border-cyan-800 bg-amber-100 p-3 text-xl font-bold text-slate-800"
			href={`/dashboard/lists/${id}`}
		>
			<span
				>{#if title}
					{title}
				{:else}
					list
				{/if}
			</span>
			<date
				class="flex items-center gap-2 rounded-lg bg-cyan-800 p-1 text-sm font-thin text-amber-100"
			>
				<Icon icon="mdi:calendar" class="size-4" />
				{dayjs(created_at).format('DD.MM.YYYY')}</date
			></a
		>
	{/each}
</section>
