<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
	import { onMount } from 'svelte'
	import { browser, dev } from '$app/environment'

	const loadRPC = !dev && browser

	let ReloadPrompt
	onMount(async () => {
		loadRPC && (ReloadPrompt = (await import('$lib/ReloadPrompt.svelte')).default)
	})
</script>

<svelte:head>
	{#if !dev}
		<link rel="manifest" href="/manifest.webmanifest">
	{/if}
</svelte:head>

<Header />

<main>
	<slot />
</main>

<footer>
	<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
</footer>

{#if ReloadPrompt}
	<svelte:component this={ReloadPrompt} />
{/if}

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
