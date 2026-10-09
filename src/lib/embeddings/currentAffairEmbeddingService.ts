import {
  buildCurrentAffairEmbeddingEligibility,
  type CurrentAffairEmbeddingInput,
} from "./currentAffairEmbedding";
import {
  fingerprintEmbeddingText,
  type EmbeddingFingerprintResult,
} from "./fingerprint";
import { EMBEDDING_CONTRACT } from "./types";

export type CurrentAffairEmbeddingDecision =
  | {
      action: "skip";
      reason: "not_published" | "no_embeddable_text";
      currentAffairId: string;
    }
  | {
      action: "already_embedded";
      currentAffairId: string;
      fingerprint: string;
    }
  | {
      action: "needs_embedding";
      currentAffairId: string;
      source: "original_content" | "summary";
      canonicalText: string;
      fingerprint: string;
      fingerprintAlgorithm: EmbeddingFingerprintResult["algorithm"];
      provider: typeof EMBEDDING_CONTRACT.provider;
      model: typeof EMBEDDING_CONTRACT.model;
      dimensions: typeof EMBEDDING_CONTRACT.dimensions;
    };

export async function decideCurrentAffairEmbedding(
  input: CurrentAffairEmbeddingInput,
  existingFingerprint?: string | null
): Promise<CurrentAffairEmbeddingDecision> {
  const eligibility =
    buildCurrentAffairEmbeddingEligibility(input);

  if (!eligibility.eligible) {
    return {
      action: "skip",
      reason: eligibility.reason,
      currentAffairId: input.id,
    };
  }

  const fingerprintResult =
    await fingerprintEmbeddingText(eligibility.canonicalText);

  if (existingFingerprint === fingerprintResult.fingerprint) {
    return {
      action: "already_embedded",
      currentAffairId: input.id,
      fingerprint: fingerprintResult.fingerprint,
    };
  }

  return {
    action: "needs_embedding",
    currentAffairId: input.id,
    source: eligibility.source,
    canonicalText: eligibility.canonicalText,
    fingerprint: fingerprintResult.fingerprint,
    fingerprintAlgorithm: fingerprintResult.algorithm,
    provider: EMBEDDING_CONTRACT.provider,
    model: EMBEDDING_CONTRACT.model,
    dimensions: EMBEDDING_CONTRACT.dimensions,
  };
}
