export const runtime = "edge";

interface UserInformation {
  bodyParts: string[];
  workoutType?: string | null;
  additionalDetails?: string | null;
}

export async function POST(request: Request) {
  const body = await request.json();
  const prompt = constructPrompt(body);
  try {
    const payload = {
      model: "anthropic/claude-3.5-haiku",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
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

    const data = await response.json();

    if (data.error) {
      console.error("OpenRouter API Error:", data.error);
      return new Response("OpenRouter API error", {
        status: response.status || 500,
      });
    }

    return new Response(
      JSON.stringify({
        message: data.choices?.[0]?.message?.content || "No response",
      }),
    );
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
