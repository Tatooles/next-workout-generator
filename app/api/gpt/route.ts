export const runtime = "edge";

export async function POST(request: Request) {
  const body = await request.json();
  const prompt = constructPrompt(body);
  try {
    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenAI API Error:", data.error);
      return new Response(
        "OpenAI API error", 
        { status: response.status || 500 }
      );
    }
    
    return new Response(
      JSON.stringify({ message: data.choices?.[0]?.message?.content || "No response" })
    );
  } catch (error) {
    console.log("An error ocurred!", error);
    return new Response(JSON.stringify({ error: "Failed to generate workout" }), { status: 500 });
  }
}

function constructPrompt(userInformation: any) {
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
