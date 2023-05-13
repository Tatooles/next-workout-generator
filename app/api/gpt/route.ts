import { Configuration, OpenAIApi } from "openai";

export const runtime = "edge";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  const body = await request.json();
  const prompt = constructPrompt(body);
  console.log(prompt);
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    });
    return new Response(
      JSON.stringify({ message: completion.data.choices[0].message?.content })
    );
  } catch (error) {
    console.log("An error ocurred!");
    if (error instanceof Error) console.log(error.message);
  }
}

function constructPrompt(userInformation: any) {
  console.log(userInformation);
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
