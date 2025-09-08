<script lang="ts">
  import type { CitationStyle } from '../types';
  import { citationStyle } from '../stores/citations';

  const styles: { value: CitationStyle; label: string; description: string }[] = [
    {
      value: 'APA',
      label: 'APA',
      description: 'American Psychological Association - commonly used in psychology, education, and social sciences'
    },
    {
      value: 'MLA',
      label: 'MLA',
      description: 'Modern Language Association - commonly used in literature, language, and humanities'
    },
    {
      value: 'Chicago',
      label: 'Chicago',
      description: 'Chicago Manual of Style - commonly used in history, literature, and arts'
    }
  ];

  function handleStyleChange(style: CitationStyle) {
    citationStyle.set(style);
  }
</script>

<div class="bg-white rounded-lg shadow-md p-6 mb-6">
  <h2 class="text-2xl font-bold mb-4">Citation Style</h2>
  
  <div class="grid gap-4 md:grid-cols-3">
    {#each styles as style}
      <label class="cursor-pointer">
        <input
          type="radio"
          bind:group={$citationStyle}
          value={style.value}
          on:change={() => handleStyleChange(style.value)}
          class="sr-only"
        />
        <div 
          class="border-2 rounded-lg p-4 transition-all hover:shadow-md {$citationStyle === style.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-lg {$citationStyle === style.value ? 'text-blue-900' : 'text-gray-900'}">
              {style.label}
            </h3>
            {#if $citationStyle === style.value}
              <div class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
            {:else}
              <div class="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
            {/if}
          </div>
          <p class="text-sm {$citationStyle === style.value ? 'text-blue-700' : 'text-gray-600'}">
            {style.description}
          </p>
        </div>
      </label>
    {/each}
  </div>

  <div class="mt-6 p-4 bg-gray-50 rounded-lg">
    <h4 class="font-medium text-gray-900 mb-2">Current Selection: {$citationStyle}</h4>
    <p class="text-sm text-gray-600">
      All citations and bibliography will be formatted using the {$citationStyle} style. 
      You can change this at any time and all formatting will update automatically.
    </p>
  </div>
</div>