import { generateDocumentEmbedding } from "@/lib/embeddings/embeddingClient";
import type { GenerateDocumentEmbeddingResult } from "@/lib/embeddings/embeddingClient";

export type CurrentAffairEmbeddingRunResult =
  GenerateDocumentEmbeddingResult;

export async function embedCurrentAffair(
  currentAffairId: string,
): Promise<CurrentAffairEmbeddingRunResult> {
  const normalizedId = currentAffairId.trim();

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      normalizedId,
    )
  ) {
    throw new Error("A valid current-affair ID is required.");
  }

  return generateDocumentEmbedding(normalizedId);
}
