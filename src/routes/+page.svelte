<script lang="ts">
  import { onMount } from 'svelte';
  import type { Citation } from '$lib/types';
  import { citations, citationStyle } from '$lib/stores/citations';
  import CitationForm from '$lib/components/CitationForm.svelte';
  import CitationList from '$lib/components/CitationList.svelte';
  import Bibliography from '$lib/components/Bibliography.svelte';
  import StyleSelector from '$lib/components/StyleSelector.svelte';
  
  let editingCitation: Citation | null = null;

  onMount(() => {
    citations.load();
    citationStyle.load();
  });

  function handleEdit(citation: Citation) {
    editingCitation = citation;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    editingCitation = null;
  }
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <header class="text-center mb-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-2">
      Simple Citation & Bibliography Manager
    </h1>
    <p class="text-lg text-gray-600">
      Create, manage, and export citations in APA, MLA, and Chicago styles
    </p>
  </header>

  <StyleSelector />
  
  <CitationForm 
    {editingCitation}
    onCancel={handleCancelEdit}
  />
  
  <div class="grid gap-6 lg:grid-cols-1">
    <CitationList onEdit={handleEdit} />
    <Bibliography />
  </div>

  <footer class="mt-12 text-center text-sm text-gray-500">
    <p>
      Built with SvelteKit • All data stored locally in your browser • 
      <a href="https://github.com" class="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener">
        View on GitHub
      </a>
    </p>
  </footer>
</div>
