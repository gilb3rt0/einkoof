<script lang="ts">
	import type { HTMLLabelAttributes } from 'svelte/elements';

	let {
		error,
		children,
		...rest
	}: {
		error?: boolean;
		children?: any;
	} & HTMLLabelAttributes = $props();
</script>

<label {...rest} class={`text-xs ${error ? 'text-red-400' : 'text-amber-100'} ${rest.class ?? ''}`}>
	{@render children?.()}
</label>
