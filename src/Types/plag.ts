export interface PlagiarismCheckResult {
  status: string;
  score: {
    plagiarism: number;
    unique: number;
  };
  metadata: {
    total_sentences: number;
    matched_sentences: number;
  };
  matches: Array<{
    sentence: string;
    source: string;
  }>;
  sources_list: string[];
  top_source: string;
}