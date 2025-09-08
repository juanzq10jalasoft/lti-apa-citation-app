<script lang="ts">
  import type { SourceType, Citation, FormData } from '../types';
  import { citations } from '../stores/citations';
  
  export let editingCitation: Citation | null = null;
  export let onCancel: () => void = () => {};
  
  let sourceType: SourceType = 'website';
  let formData: FormData = { type: 'website' };

  $: {
    if (editingCitation) {
      sourceType = editingCitation.type;
      formData = { ...editingCitation };
    } else {
      resetForm();
    }
  }

  function resetForm() {
    formData = {
      type: sourceType,
      title: '',
      author: sourceType === 'website' ? '' : [],
      ...(sourceType === 'website' && { url: '', accessDate: '' }),
      ...(sourceType === 'book' && { year: '', publisher: '', isbn: '' }),
      ...(sourceType === 'journal' && { 
        journalName: '', 
        year: '', 
        volume: '', 
        issue: '', 
        pages: '' 
      })
    };
  }

  function handleSourceTypeChange() {
    resetForm();
  }

  function handleSubmit() {
    const citation: Citation = {
      id: editingCitation?.id || crypto.randomUUID(),
      ...formData,
      type: sourceType
    } as Citation;

    if (editingCitation) {
      citations.update(editingCitation.id, citation);
    } else {
      citations.add(citation);
    }
    
    resetForm();
    onCancel();
  }

  function addAuthor() {
    if (Array.isArray(formData.authors)) {
      formData.authors = [...formData.authors, ''];
    } else {
      formData.authors = [''];
    }
    formData = formData; // trigger reactivity
  }

  function removeAuthor(index: number) {
    if (Array.isArray(formData.authors)) {
      formData.authors = formData.authors.filter((_, i) => i !== index);
      formData = formData; // trigger reactivity
    }
  }
</script>

<div class="bg-white rounded-lg shadow-md p-6 mb-6">
  <h2 class="text-2xl font-bold mb-4">
    {editingCitation ? 'Edit Citation' : 'Add New Citation'}
  </h2>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Source Type
      </label>
      <select 
        bind:value={sourceType} 
        on:change={handleSourceTypeChange}
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="website">Website</option>
        <option value="book">Book</option>
        <option value="journal">Journal Article</option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Title
      </label>
      <input 
        type="text" 
        bind:value={formData.title}
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter title"
      />
    </div>

    {#if sourceType === 'website'}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Author
        </label>
        <input 
          type="text" 
          bind:value={formData.author}
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter author name"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          URL
        </label>
        <input 
          type="url" 
          bind:value={formData.url}
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Access Date
        </label>
        <input 
          type="date" 
          bind:value={formData.accessDate}
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    {:else if sourceType === 'book'}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Authors
        </label>
        {#each formData.authors || [] as author, index}
          <div class="flex mb-2">
            <input 
              type="text" 
              bind:value={author}
              required
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Author name"
            />
            <button 
              type="button" 
              on:click={() => removeAuthor(index)}
              class="ml-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        {/each}
        <button 
          type="button" 
          on:click={addAuthor}
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Add Author
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <input 
            type="text" 
            bind:value={formData.year}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="2023"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Publisher
          </label>
          <input 
            type="text" 
            bind:value={formData.publisher}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Publisher name"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          ISBN (optional)
        </label>
        <input 
          type="text" 
          bind:value={formData.isbn}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="978-0-123456-78-9"
        />
      </div>
    {:else if sourceType === 'journal'}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Authors
        </label>
        {#each formData.authors || [] as author, index}
          <div class="flex mb-2">
            <input 
              type="text" 
              bind:value={author}
              required
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Author name"
            />
            <button 
              type="button" 
              on:click={() => removeAuthor(index)}
              class="ml-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        {/each}
        <button 
          type="button" 
          on:click={addAuthor}
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Add Author
        </button>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Journal Name
        </label>
        <input 
          type="text" 
          bind:value={formData.journalName}
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Journal of Example Studies"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <input 
            type="text" 
            bind:value={formData.year}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="2023"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Volume
          </label>
          <input 
            type="text" 
            bind:value={formData.volume}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="12"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Issue
          </label>
          <input 
            type="text" 
            bind:value={formData.issue}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="3"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Pages
          </label>
          <input 
            type="text" 
            bind:value={formData.pages}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123-145"
          />
        </div>
      </div>
    {/if}

    <div class="flex gap-4 pt-4">
      <button 
        type="submit"
        class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {editingCitation ? 'Update Citation' : 'Add Citation'}
      </button>
      
      {#if editingCitation}
        <button 
          type="button"
          on:click={onCancel}
          class="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      {/if}
    </div>
  </form>
</div>