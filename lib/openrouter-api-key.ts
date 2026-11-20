export class MissingOpenRouterApiKeyError extends Error {
  constructor() {
    super("Server configuration error: OPENROUTER_API_KEY is not set.");
    this.name = "MissingOpenRouterApiKeyError";
  }
}

export function openRouterAuthorizationHeader(
  apiKey: string | undefined,
): string {
  const trimmedKey = apiKey?.trim() ?? "";

  if (!trimmedKey) {
    throw new MissingOpenRouterApiKeyError();
  }

  return `Bearer ${trimmedKey}`;
}
