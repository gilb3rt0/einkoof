<script lang="ts">
	import {
		Button,
		EinkoofBanner,
		ErrorMessage,
		Label,
		PasswordInput,
		Switch,
		TextInput
	} from '$lib';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	let action: 'login' | 'register' = $state('login');
	let {
		data
	}: {
		data: PageData & {
			form: FormResult<{
				username: string;
				email: string;
				password: string;
			}>;
		};
	} = $props();
	const { form, errors, enhance, submitting, constraints } = superForm(data.form, {
		multipleSubmits: 'allow'
	});
</script>

<EinkoofBanner />

<form
	use:enhance
	method="POST"
	action={action === 'register' ? '?/register' : '?/login'}
	class="mt-6 flex max-w-sm flex-col gap-4"
	novalidate
>
	<Switch
		label={{ text: 'create an account', for: 'action' }}
		id="action"
		onchange={(e) => (action = e.currentTarget.checked ? 'register' : 'login')}
	/>
	{#if action === 'register'}
		<div class="flex flex-col gap-2">
			<Label for="username" error={!!$errors.username}>username</Label>
			<TextInput
				{...$constraints.username}
				bind:value={$form.username}
				error={!!$errors.username}
				disabled={$submitting}
				name="username"
				placeholder="username"
				aria-invalid={!!$errors.username}
			/>
			{#if $errors.username}
				{#each $errors.username as error}
					<ErrorMessage {error} />
				{/each}
			{/if}
		</div>
	{/if}
	<div class="flex flex-col gap-2">
		<Label for="email" error={!!$errors.email}>email</Label>
		<TextInput
			bind:value={$form.email}
			disabled={$submitting}
			error={!!$errors.email}
			name="email"
			placeholder="email"
			aria-invalid={!!$errors.email}
			{...$constraints.email}
		/>
		{#if $errors.email}
			{#each $errors.email as error}
				<ErrorMessage {error} />
			{/each}
		{/if}
	</div>
	<div class="relative flex flex-col gap-2">
		<Label for="password" error={!!$errors.password}>password</Label>
		<PasswordInput
			bind:value={$form.password}
			name="password"
			disabled={$submitting}
			placeholder="password"
			{...$constraints.password}
		/>
		{#if $errors.password}
			{#each $errors.password as error}
				<ErrorMessage {error} />
			{/each}
		{/if}
	</div>
	<Button type="submit" text={action} />
</form>
