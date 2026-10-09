export interface EmbeddingFingerprintResult {
  algorithm: "sha256";
  fingerprint: string;
}

export async function fingerprintEmbeddingText(
  canonicalText: string
): Promise<EmbeddingFingerprintResult> {
  const normalizedText = canonicalText
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ");

  const encoder = new TextEncoder();
  const data = encoder.encode(normalizedText);
  const digest = await crypto.subtle.digest("SHA-256", data);

  const bytes = new Uint8Array(digest);

  const fingerprint = Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return {
    algorithm: "sha256",
    fingerprint,
  };
}
