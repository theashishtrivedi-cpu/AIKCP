import { supabase } from "@/lib/supabase";
import { EMBEDDING_CONTRACT } from "./types";

export type GenerateDocumentEmbeddingResult =
  | {
      success: true;
      action: "already_embedded";
      currentAffairId: string;
      fingerprint: string;
      provider: typeof EMBEDDING_CONTRACT.provider;
      model: typeof EMBEDDING_CONTRACT.model;
      dimensions: typeof EMBEDDING_CONTRACT.dimensions;
    }
  | {
      success: true;
      action: "embedded";
      currentAffairId: string;
      embeddingId: string;
      fingerprint: string;
      source: "original_content" | "summary";
      provider: typeof EMBEDDING_CONTRACT.provider;
      model: typeof EMBEDDING_CONTRACT.model;
      dimensions: typeof EMBEDDING_CONTRACT.dimensions;
    };

export async function generateDocumentEmbedding(
  currentAffairId: string,
): Promise<GenerateDocumentEmbeddingResult> {
  const { data, error } = await supabase.functions.invoke(
    "generate-embedding",
    {
      body: { current_affair_id: currentAffairId },
    },
  );

  if (error) {
    throw new Error(`Embedding request failed: ${error.message}`);
  }

  if (
    typeof data !== "object" ||
    data === null ||
    data.success !== true ||
    (data.action !== "embedded" &&
      data.action !== "already_embedded") ||
    data.currentAffairId !== currentAffairId ||
    typeof data.fingerprint !== "string" ||
    !/^[0-9a-f]{64}$/.test(data.fingerprint) ||
    data.provider !== EMBEDDING_CONTRACT.provider ||
    data.model !== EMBEDDING_CONTRACT.model ||
    data.dimensions !== EMBEDDING_CONTRACT.dimensions
  ) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : "The embedding function returned invalid metadata.";
    throw new Error(message);
  }

  if (data.action === "embedded") {
    if (
      typeof data.embeddingId !== "string" ||
      (data.source !== "original_content" && data.source !== "summary")
    ) {
      throw new Error("The embedding function returned invalid persistence metadata.");
    }

    return {
      success: true,
      action: "embedded",
      currentAffairId,
      embeddingId: data.embeddingId,
      fingerprint: data.fingerprint,
      source: data.source,
      provider: EMBEDDING_CONTRACT.provider,
      model: EMBEDDING_CONTRACT.model,
      dimensions: EMBEDDING_CONTRACT.dimensions,
    };
  }

  return {
    success: true,
    action: "already_embedded",
    currentAffairId,
    fingerprint: data.fingerprint,
    provider: EMBEDDING_CONTRACT.provider,
    model: EMBEDDING_CONTRACT.model,
    dimensions: EMBEDDING_CONTRACT.dimensions,
  };
}
