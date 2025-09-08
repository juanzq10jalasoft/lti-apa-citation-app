<script lang="ts">
	import '../app.css';
	import LTIWrapper from '$lib/components/LTIWrapper.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<svelte:head>
	<title>Simple Citation & Bibliography Manager</title>
	<meta name="description" content="A lightweight citation manager for APA, MLA, and Chicago styles" />
</svelte:head>

<div class="min-h-screen bg-gray-100">
	<LTIWrapper ltiContextData={data.ltiContext} isLTILaunch={data.isLTILaunch}>
		<slot />
	</LTIWrapper>
</div>
