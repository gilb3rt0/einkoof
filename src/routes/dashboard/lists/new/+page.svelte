<script lang="ts">
	import { EinkoofBanner, TextInput, Checkbox, ErrorMessage } from '$lib';
	import Icon from '@iconify/svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, errors, enhance, constraints, submitting } = superForm(
		{
			...data.form,
			items: [
				{
					title: '',
					checked: false
				}
			]
		},
		{
			dataType: 'json'
		}
	);
	console.log(JSON.stringify($errors));
</script>

<EinkoofBanner />
<form method="POST" use:enhance class="flex flex-col gap-2">
	{#each $form.items as item, i}
		<div class="group flex flex-col gap-2">
			<label
				class={`text-xs ${$errors?.items && $errors?.items[i]?.title ? 'text-red-400' : 'text-amber-100'}`}
				for={`title-${i}`}>item {i + 1}</label
			>
			<div class="flex items-center gap-2">
				<TextInput
					id={`title-${i}`}
					bind:value={item.title}
					error={!!($errors.items && $errors.items[i])}
					disabled={!!$submitting}
				/>
				<label class="sr-only" for={`checked-${i}`}>checked</label>
				<Checkbox
					disabled={!!$submitting}
					error={!!($errors.items && $errors.items[i])}
					id={`checked-${i}`}
					bind:checked={item.checked}
				/>
				{#if $form.items?.length > 1 && i !== 0}
					<button
						type="button"
						class="hidden w-min rounded-lg border-2 border-amber-100 p-1 outline-offset-2 transition-transform hover:scale-105 focus:scale-105 focus:outline-red-400 group-focus-within:block group-hover:block"
						onclick={() => ($form.items = $form.items.filter((_, j) => j !== i))}
					>
						<span class="sr-only">remove item</span>
						<Icon icon="mdi:close" class="size-6 text-red-400" />
					</button>
				{/if}
			</div>
			{#if $errors?.items && $errors?.items[i] && $errors?.items[i]?.title}
				{#each $errors?.items[i]?.title as error}
					<ErrorMessage {error} />
				{/each}
			{/if}
		</div>
	{/each}
	<button
		type="button"
		class="w-min rounded-lg border-2 border-amber-100 p-2 outline-offset-2 transition-transform hover:scale-105 focus:scale-105 focus:outline-cyan-800"
		onclick={() => ($form.items = [...$form.items, { title: '', checked: false }])}
	>
		<span class="sr-only"> add item </span>
		<Icon icon="mdi:plus" class="size-6 text-cyan-800" />
	</button>
	<button class="rounded-lg bg-cyan-200 p-2 text-slate-800">submit</button>
</form>
