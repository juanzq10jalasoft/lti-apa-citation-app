<script lang="ts">
  import { citations, citationStyle } from '../stores/citations';
  import { exportBibliography, downloadTextFile } from '../utils/formatter';
  
  let isExporting = false;

  async function copyBibliography() {
    if ($citations.length === 0) {
      alert('No citations to copy!');
      return;
    }

    try {
      const bibliography = exportBibliography($citations, $citationStyle);
      await navigator.clipboard.writeText(bibliography);
      alert('Bibliography copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy bibliography:', err);
      alert('Failed to copy bibliography to clipboard');
    }
  }

  function downloadBibliography() {
    if ($citations.length === 0) {
      alert('No citations to export!');
      return;
    }

    isExporting = true;
    try {
      const bibliography = exportBibliography($citations, $citationStyle);
      const filename = `bibliography_${$citationStyle.toLowerCase()}_${new Date().toISOString().split('T')[0]}.txt`;
      downloadTextFile(bibliography, filename);
    } catch (err) {
      console.error('Failed to download bibliography:', err);
      alert('Failed to download bibliography');
    } finally {
      isExporting = false;
    }
  }

  function clearAllCitations() {
    if (confirm('Are you sure you want to delete all citations? This action cannot be undone.')) {
      citations.clear();
    }
  }
</script>

<div class="bg-white rounded-lg shadow-md p-6">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-2xl font-bold">Bibliography</h2>
    
    <div class="flex gap-2">
      <button
        on:click={copyBibliography}
        disabled={$citations.length === 0}
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Copy bibliography to clipboard"
      >
        Copy All
      </button>
      
      <button
        on:click={downloadBibliography}
        disabled={$citations.length === 0 || isExporting}
        class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Download bibliography as .txt file"
      >
        {isExporting ? 'Exporting...' : 'Export .txt'}
      </button>
      
      <button
        on:click={clearAllCitations}
        disabled={$citations.length === 0}
        class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Clear all citations"
      >
        Clear All
      </button>
    </div>
  </div>

  {#if $citations.length === 0}
    <div class="text-center py-8">
      <p class="text-gray-500 mb-4">No citations to display in bibliography.</p>
      <p class="text-sm text-gray-400">Add some citations above to see your formatted bibliography here.</p>
    </div>
  {:else}
    <div class="mb-4 p-3 bg-gray-50 rounded">
      <p class="text-sm text-gray-700">
        <strong>Style:</strong> {$citationStyle} | 
        <strong>Citations:</strong> {$citations.length}
      </p>
    </div>

    <div class="space-y-4">
      <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 class="font-semibold text-lg mb-3 text-gray-800">Complete Bibliography ({$citationStyle})</h3>
        <div class="text-sm text-gray-800 leading-relaxed whitespace-pre-line font-mono">
          {exportBibliography($citations, $citationStyle)}
        </div>
      </div>
    </div>
  {/if}
</div>