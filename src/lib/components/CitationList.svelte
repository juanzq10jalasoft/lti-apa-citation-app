<script lang="ts">
  import type { Citation } from '../types';
  import { citations, citationStyle } from '../stores/citations';
  import { formatCitation } from '../utils/formatter';
  
  export let onEdit: (citation: Citation) => void = () => {};

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this citation?')) {
      citations.remove(id);
    }
  }

  async function copyCitation(citation: Citation) {
    try {
      const formatted = formatCitation(citation, $citationStyle);
      await navigator.clipboard.writeText(formatted);
      alert('Citation copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy citation:', err);
      alert('Failed to copy citation to clipboard');
    }
  }

  function getSourceTypeLabel(type: string): string {
    switch (type) {
      case 'website':
        return 'Website';
      case 'book':
        return 'Book';
      case 'journal':
        return 'Journal Article';
      default:
        return type;
    }
  }
</script>

<div class="bg-white rounded-lg shadow-md p-6">
  <h2 class="text-2xl font-bold mb-4">Citations</h2>
  
  {#if $citations.length === 0}
    <p class="text-gray-500 text-center py-8">
      No citations added yet. Add your first citation above!
    </p>
  {:else}
    <div class="space-y-4">
      {#each $citations as citation (citation.id)}
        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start mb-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {getSourceTypeLabel(citation.type)}
                </span>
              </div>
              <h3 class="font-semibold text-lg mb-1">{citation.title}</h3>
              
              {#if citation.type === 'website'}
                <p class="text-gray-600 text-sm">
                  Author: {citation.author} | Accessed: {citation.accessDate}
                </p>
                <p class="text-gray-500 text-sm break-all">{citation.url}</p>
              {:else if citation.type === 'book'}
                <p class="text-gray-600 text-sm">
                  Authors: {citation.authors.join(', ')} | {citation.year} | {citation.publisher}
                </p>
                {#if citation.isbn}
                  <p class="text-gray-500 text-sm">ISBN: {citation.isbn}</p>
                {/if}
              {:else if citation.type === 'journal'}
                <p class="text-gray-600 text-sm">
                  Authors: {citation.authors.join(', ')} | {citation.journalName}
                </p>
                <p class="text-gray-500 text-sm">
                  Vol. {citation.volume}, Issue {citation.issue} ({citation.year}), pp. {citation.pages}
                </p>
              {/if}
            </div>
            
            <div class="flex flex-col gap-2 ml-4">
              <button
                on:click={() => copyCitation(citation)}
                class="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                title="Copy formatted citation"
              >
                Copy
              </button>
              
              <button
                on:click={() => onEdit(citation)}
                class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Edit citation"
              >
                Edit
              </button>
              
              <button
                on:click={() => handleDelete(citation.id)}
                class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                title="Delete citation"
              >
                Delete
              </button>
            </div>
          </div>
          
          <div class="mt-3 p-3 bg-gray-50 rounded text-sm">
            <strong class="text-gray-700">{$citationStyle} Format:</strong>
            <p class="mt-1 text-gray-800">{formatCitation(citation, $citationStyle)}</p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>