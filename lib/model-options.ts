export const ALLOWED_MODELS = [
  "google/gemini-3.7-flash",
  "z-ai/glm-5.3",
  "moonshotai/kimi-k3",
  "openai/gpt-5.6-luna",
  "anthropic/claude-haiku-4.5",
  "openrouter/free",
] as const;

export type GenerationModel = (typeof ALLOWED_MODELS)[number];

export const DEFAULT_MODEL: GenerationModel = "google/gemini-3.7-flash";

export function isGenerationModel(model: string): model is GenerationModel {
  return ALLOWED_MODELS.some((allowedModel) => allowedModel === model);
}

export const MODEL_LABELS: Record<GenerationModel, string> = {
  "google/gemini-3.7-flash": "Gemini 3.7 Flash",
  "z-ai/glm-5.3": "GLM 5.3",
  "moonshotai/kimi-k3": "Kimi K3",
  "openai/gpt-5.6-luna": "GPT-5.6 Luna",
  "anthropic/claude-haiku-4.5": "Claude Haiku 4.5",
  "openrouter/free": "Free Models",
};
