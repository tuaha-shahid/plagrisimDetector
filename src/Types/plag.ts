export interface PlagiarismCheckResult {
  status: string;
  score: {
    plagiarism: number;
    unique: number;
  };
  metadata: {
    total_sentences: number;
    matched_sentences: number;
    total_words: number;
  };
  matches: Array<{ sentence: string; source: string; percentage: number }>;
  sources_list: string[];
  top_source: string;
}