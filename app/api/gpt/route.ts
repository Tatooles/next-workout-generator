import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  const body = await request.json();
  const prompt = constructPrompt(body);
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
  let prompt = "";
  if (userInformation.workoutType) {
    prompt = `Generate a ${userInformation.workoutType} for me`;
  }
  if (userInformation.additionalDetails) {
    prompt += `Here are some additional details: ${userInformation.additionalDetails}`;
  }
  return prompt;
}
