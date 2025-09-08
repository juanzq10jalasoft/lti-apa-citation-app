<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { setLTIContext, clearLTIContext, ltiContext, isLTIMode } from '$lib/lti/context.js';
  import type { LTILaunchData } from '$lib/lti/types.js';

  // Props from layout server load
  export let ltiContextData: any = null;
  export let isLTILaunch: boolean = false;

  onMount(() => {
    // Initialize LTI context if we have LTI data
    if (isLTILaunch && ltiContextData) {
      setLTIContext(ltiContextData as LTILaunchData);
    } else {
      clearLTIContext();
    }
  });
</script>

{#if $isLTIMode}
  <div class="lti-wrapper bg-blue-50 border-b border-blue-200">
    <div class="container mx-auto px-4 py-2">
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center space-x-4">
          <span class="text-blue-700 font-medium">
            📚 LTI Mode Active
          </span>
          {#if $ltiContext}
            <span class="text-gray-600">
              User: {$ltiContext.user.name}
            </span>
            <span class="text-gray-600">
              Context: {$ltiContext.context.title}
            </span>
          {/if}
        </div>
        <div class="flex items-center space-x-2">
          {#if $ltiContext?.isInstructor}
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              Instructor
            </span>
          {:else if $ltiContext?.isStudent}
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              Student
            </span>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<slot />