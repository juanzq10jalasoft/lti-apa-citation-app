import type { Citation, CitationStyle, WebsiteCitation, BookCitation, JournalCitation } from '../types';

export function formatCitation(citation: Citation, style: CitationStyle): string {
  switch (style) {
    case 'APA':
      return formatAPA(citation);
    case 'MLA':
      return formatMLA(citation);
    case 'Chicago':
      return formatChicago(citation);
    default:
      return '';
  }
}

function formatAPA(citation: Citation): string {
  switch (citation.type) {
    case 'website': {
      const c = citation as WebsiteCitation;
      return `${c.author}. (${new Date(c.accessDate).getFullYear()}). ${c.title}. Retrieved ${c.accessDate}, from ${c.url}`;
    }
    case 'book': {
      const c = citation as BookCitation;
      const authors = c.authors.join(', ');
      return `${authors}. (${c.year}). *${c.title}*. ${c.publisher}.`;
    }
    case 'journal': {
      const c = citation as JournalCitation;
      const authors = c.authors.join(', ');
      return `${authors}. (${c.year}). ${c.title}. *${c.journalName}*, ${c.volume}(${c.issue}), ${c.pages}.`;
    }
    default:
      return '';
  }
}

function formatMLA(citation: Citation): string {
  switch (citation.type) {
    case 'website': {
      const c = citation as WebsiteCitation;
      return `${c.author}. "${c.title}." Web. ${c.accessDate}. <${c.url}>.`;
    }
    case 'book': {
      const c = citation as BookCitation;
      const authors = c.authors.join(', ');
      return `${authors}. *${c.title}*. ${c.publisher}, ${c.year}.`;
    }
    case 'journal': {
      const c = citation as JournalCitation;
      const authors = c.authors.join(', ');
      return `${authors}. "${c.title}." *${c.journalName}* ${c.volume}.${c.issue} (${c.year}): ${c.pages}.`;
    }
    default:
      return '';
  }
}

function formatChicago(citation: Citation): string {
  switch (citation.type) {
    case 'website': {
      const c = citation as WebsiteCitation;
      return `${c.author}. "${c.title}." Accessed ${c.accessDate}. ${c.url}.`;
    }
    case 'book': {
      const c = citation as BookCitation;
      const authors = c.authors.join(', ');
      return `${authors}. *${c.title}*. ${c.publisher}, ${c.year}.`;
    }
    case 'journal': {
      const c = citation as JournalCitation;
      const authors = c.authors.join(', ');
      return `${authors}. "${c.title}." *${c.journalName}* ${c.volume}, no. ${c.issue} (${c.year}): ${c.pages}.`;
    }
    default:
      return '';
  }
}

export function exportBibliography(citations: Citation[], style: CitationStyle): string {
  const formatted = citations.map(citation => formatCitation(citation, style));
  return formatted.join('\n\n');
}

export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}