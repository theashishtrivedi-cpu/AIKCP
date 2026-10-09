export type CurrentAffairEmbeddingSource =
  | "original_content"
  | "summary";

export type CurrentAffairEmbeddingEligibility =
  | {
      eligible: true;
      source: CurrentAffairEmbeddingSource;
      canonicalText: string;
    }
  | {
      eligible: false;
      reason:
        | "not_published"
        | "no_embeddable_text";
    };

export interface CurrentAffairEmbeddingInput {
  id: string;
  title: string;
  original_content: string | null;
  summary: string | null;
  status: "draft" | "pending" | "published" | "rejected" | "archived";
}

function normalizeEmbeddingText(value: string | null | undefined): string {
  return (value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ");
}

export function buildCurrentAffairEmbeddingEligibility(
  input: CurrentAffairEmbeddingInput
): CurrentAffairEmbeddingEligibility {
  if (input.status !== "published") {
    return {
      eligible: false,
      reason: "not_published",
    };
  }

  const title = normalizeEmbeddingText(input.title);
  const originalContent = normalizeEmbeddingText(input.original_content);
  const summary = normalizeEmbeddingText(input.summary);

  if (originalContent) {
    return {
      eligible: true,
      source: "original_content",
      canonicalText: `title: ${title} | text: ${originalContent}`,
    };
  }

  if (summary) {
    return {
      eligible: true,
      source: "summary",
      canonicalText: `title: ${title} | text: ${summary}`,
    };
  }

  return {
    eligible: false,
    reason: "no_embeddable_text",
  };
}
