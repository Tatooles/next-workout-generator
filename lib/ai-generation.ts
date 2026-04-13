import { z } from "zod";

export const ALLOWED_MODELS = [
  "google/gemini-3-flash-preview",
  "moonshotai/kimi-k2.5",
  "openai/gpt-5-mini",
  "anthropic/claude-3.5-haiku",
  "meta-llama/llama-3.3-70b-instruct:free",
] as const;

export const DEFAULT_MODEL = "google/gemini-3-flash-preview";

export class GenerationError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export function resolveRequestedModel(model: string | null | undefined) {
  const requestedModel = model || DEFAULT_MODEL;

  if (
    !ALLOWED_MODELS.includes(requestedModel as (typeof ALLOWED_MODELS)[number])
  ) {
    throw new GenerationError(
      "Invalid model specified. Please select a valid model.",
      400,
    );
  }

  return requestedModel;
}

export async function fetchOpenRouterCompletion(
  prompt: string,
  model: string,
  title: string,
) {
  const payload = {
    model,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.8,
    stream: false,
  };

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY ?? ""}`,
      "HTTP-Referer": process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000",
      "X-Title": title,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error("OpenRouter API Error:", response.status);
    throw new GenerationError("OpenRouter API error", response.status || 500);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

export function parseStructuredJson<T>(
  content: string,
  schema: z.ZodType<T>,
): { success: true; data: T } | { success: false; error: string } {
  try {
    let jsonStr = content.trim();
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);

    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);
    const result = schema.safeParse(parsed);

    if (!result.success) {
      return {
        success: false,
        error: result.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", "),
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof SyntaxError ? "Invalid JSON format" : "Parsing error",
    };
  }
}
