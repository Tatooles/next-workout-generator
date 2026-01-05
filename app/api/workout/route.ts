export const runtime = "edge";

// Allowlist of permitted AI models
const ALLOWED_MODELS = [
  "google/gemini-3-flash-preview",
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-4o-mini",
  "anthropic/claude-3-haiku",
  "deepseek/deepseek-chat",
  "anthropic/claude-3.5-haiku",
] as const;

const DEFAULT_MODEL = "google/gemini-3-flash-preview";

interface UserInformation {
  bodyParts: string[];
  workoutType?: string | null;
  additionalDetails?: string | null;
  model?: string | null;
}

export async function POST(request: Request) {
  const body = await request.json();
  const prompt = constructPrompt(body);

  // Validate model against allowlist
  const requestedModel = body.model || DEFAULT_MODEL;
  if (
    !ALLOWED_MODELS.includes(requestedModel as (typeof ALLOWED_MODELS)[number])
  ) {
    return new Response(
      JSON.stringify({
        error: "Invalid model specified. Please select a valid model.",
      }),
      { status: 400 },
    );
  }

  try {
    const payload = {
      model: requestedModel,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      stream: true,
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
          "X-Title": "Workout Generator",
        },
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      console.error("OpenRouter API Error:", response.status);
      return new Response("OpenRouter API error", {
        status: response.status || 500,
      });
    }

    // Create a ReadableStream to forward the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = ""; // Buffer for incomplete lines

        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              // Process any remaining buffered content before closing
              if (buffer.trim()) {
                processLine(buffer.trim(), controller);
              }
              controller.close();
              break;
            }

            // Decode the chunk and prepend any buffered partial line
            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            // Split on newlines but keep the last (potentially incomplete) line in buffer
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // Keep the last line (may be incomplete)

            for (const line of lines) {
              const trimmedLine = line.trim();

              // Skip empty lines
              if (!trimmedLine) continue;

              // Check for the done signal
              if (trimmedLine === "data: [DONE]") {
                controller.close();
                return;
              }

              processLine(trimmedLine, controller);
            }
          }
        } catch (error) {
          console.error("Stream reading error:", error);
          controller.error(error);
        }
      },
    });

    // Helper function to process a complete SSE line
    function processLine(
      trimmedLine: string,
      controller: ReadableStreamDefaultController,
    ) {
      // Parse SSE data
      if (trimmedLine.startsWith("data: ")) {
        try {
          const jsonStr = trimmedLine.slice(6); // Remove "data: " prefix
          const data = JSON.parse(jsonStr);

          // Extract the content delta
          const content = data.choices?.[0]?.delta?.content;

          if (content) {
            // Send the content token to the client
            controller.enqueue(new TextEncoder().encode(content));
          }
        } catch (e) {
          // Skip invalid JSON lines
          console.error("Failed to parse SSE line:", e);
        }
      }
    }

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.log("An error ocurred!", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate workout" }),
      { status: 500 },
    );
  }
}

function constructPrompt(userInformation: UserInformation) {
  console.log("Information from user:", userInformation);
  let prompt = "";
  if (userInformation.workoutType) {
    prompt = `Generate a ${userInformation.workoutType} for me `;
    if (userInformation.bodyParts.length) {
      prompt += `with these additional body parts:`;
      for (const part of userInformation.bodyParts) {
        prompt += ` ${part}`;
      }
    }
  } else {
    if (userInformation.bodyParts.length) {
      prompt = "Generate a workout for me to hit these body parts:";
      for (const part of userInformation.bodyParts) {
        prompt += ` ${part}`;
      }
    }
  }
  if (userInformation.additionalDetails) {
    prompt += ` Here are some additional details: ${userInformation.additionalDetails}`;
  }

  // Specify format of output
  prompt += `The workout should be in this format:
              Exercise 1: sets x reps
              Exercise 2: sets x reps
              Exercise 3: sets x reps
              etc.`;

  return prompt;
}
