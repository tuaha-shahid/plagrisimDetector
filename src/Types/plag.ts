// plagiarism-check-result.model.ts

export interface Source {
    link: string;
    count: number;
    percent: number;
  }
  
  export interface Display {
    url: string;
    des: string;
  }
  
  export interface Detail {
    query: string;
    version: number;
    unique: string;
    display: Display | null;
    excludeByUrl: boolean;
    paraphrase: string;
  }
  
  export interface PlagiarismCheckResult {
    isQueriesFinished: boolean;
    sources: Source[];
    totalQueries: number;
    plagPercent: number;
    paraphrasePercent: number;
    uniquePercent: number;
    excludeURL: string | null;
    details: Detail[];
  }
  