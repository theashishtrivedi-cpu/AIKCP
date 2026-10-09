export type EmbeddingPurpose =
  | "search_query"
  | "search_document";

export interface EmbeddingRequest {
  text: string;
  purpose: EmbeddingPurpose;
  title?: string;
}

export interface EmbeddingResult {
  provider: string;
  model: string;
  dimensions: number;
  vector: number[];
}

export interface EmbeddingProvider {
  embed(request: EmbeddingRequest): Promise<EmbeddingResult>;
}

export const EMBEDDING_CONTRACT = {
  provider: "google-gemini",
  model: "gemini-embedding-2",
  dimensions: 768,
  similarity: "cosine",
} as const;
