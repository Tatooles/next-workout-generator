export const ALLOWED_MODELS = [
  "google/gemini-3-flash-preview",
  "moonshotai/kimi-k2.5",
  "openai/gpt-5-mini",
  "anthropic/claude-3.5-haiku",
  "meta-llama/llama-3.3-70b-instruct:free",
] as const;

export type GenerationModel = (typeof ALLOWED_MODELS)[number];

export const DEFAULT_MODEL: GenerationModel = "google/gemini-3-flash-preview";

export function isGenerationModel(model: string): model is GenerationModel {
  return ALLOWED_MODELS.some((allowedModel) => allowedModel === model);
}

export const MODEL_LABELS: Record<GenerationModel, string> = {
  "google/gemini-3-flash-preview": "Gemini 3 Flash",
  "moonshotai/kimi-k2.5": "Kimi K2.5",
  "openai/gpt-5-mini": "GPT-5 Mini",
  "anthropic/claude-3.5-haiku": "Claude Haiku",
  "meta-llama/llama-3.3-70b-instruct:free": "Llama 70B Free",
};
