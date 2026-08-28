import { z } from "zod";
import {
  DEFAULT_MODEL,
  isGenerationModel,
  type GenerationModel,
} from "@/lib/model-options";

const OpenRouterCompletionSchema = z.object({
  choices: z
    .array(
      z.object({
        message: z.object({
          content: z.string().min(1),
        }),
      }),
    )
    .min(1),
});

export class GenerationError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export function resolveRequestedModel(
  model: string | null | undefined,
): GenerationModel {
  const requestedModel = model || DEFAULT_MODEL;

  if (!isGenerationModel(requestedModel)) {
    throw new GenerationError(
      "Invalid model specified. Please select a valid model.",
      400,
    );
  }

  return requestedModel;
}

export async function fetchOpenRouterCompletion(
  prompt: string,
  model: GenerationModel,
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
    reasoning:
      model === "z-ai/glm-5.3"
        ? { effort: "low", exclude: true }
        : undefined,
    stream: false,
  };

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
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
    },
  );

  if (!response.ok) {
    console.error("OpenRouter API Error:", response.status);
    throw new GenerationError("OpenRouter API error", response.status || 500);
  }

  const data: unknown = await response.json();
  const parsedResponse = OpenRouterCompletionSchema.safeParse(data);

  if (!parsedResponse.success) {
    console.error("Invalid OpenRouter response:", parsedResponse.error);
    throw new GenerationError("Invalid OpenRouter response", 502);
  }

  return parsedResponse.data.choices[0].message.content;
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

    const parsed: unknown = JSON.parse(jsonStr);
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
