export const AI_MODEL_IDS = [
  "google/gemini-3-flash-preview",
  "moonshotai/kimi-k2.5",
  "openai/gpt-5-mini",
  "anthropic/claude-3.5-haiku",
  "meta-llama/llama-3.3-70b-instruct:free",
] as const;

export type AIModelId = (typeof AI_MODEL_IDS)[number];

export const DEFAULT_AI_MODEL: AIModelId = AI_MODEL_IDS[0];

type AIModel = {
  id: AIModelId;
  name: string;
  description?: string;
};

export const AI_MODELS = [
  {
    id: AI_MODEL_IDS[0],
    name: "Gemini 3 Flash Preview",
    description: "Fast and reliable (Default)",
  },
  {
    id: AI_MODEL_IDS[1],
    name: "Kimi K2.5",
    description: "Advanced reasoning with 262k context",
  },
  {
    id: AI_MODEL_IDS[2],
    name: "GPT-5 Mini",
    description: "Advanced reasoning with 400k context",
  },
  {
    id: AI_MODEL_IDS[3],
    name: "Claude 3.5 Haiku",
    description: "Enhanced Claude",
  },
  {
    id: AI_MODEL_IDS[4],
    name: "Llama 3.3 70B",
    description: "Free and capable",
  },
] as const satisfies readonly AIModel[];
