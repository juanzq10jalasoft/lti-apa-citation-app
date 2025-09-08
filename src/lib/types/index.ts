export type CitationStyle = 'APA' | 'MLA' | 'Chicago';

export type SourceType = 'website' | 'book' | 'journal';

export interface WebsiteCitation {
  id: string;
  type: 'website';
  url: string;
  title: string;
  author: string;
  accessDate: string;
}

export interface BookCitation {
  id: string;
  type: 'book';
  title: string;
  authors: string[];
  year: string;
  publisher: string;
  isbn?: string;
}

export interface JournalCitation {
  id: string;
  type: 'journal';
  title: string;
  authors: string[];
  journalName: string;
  year: string;
  volume: string;
  issue: string;
  pages: string;
}

export type Citation = WebsiteCitation | BookCitation | JournalCitation;

export interface FormData {
  type: SourceType;
  [key: string]: string | string[];
}