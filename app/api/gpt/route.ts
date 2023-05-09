import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "What is the mascot of the Wisconsin Badgers?",
      temperature: 0.6,
    });
    console.log(completion);
    return new Response("Ok");
  } catch (error) {
    console.log("An error ocurred!");
    if (error instanceof Error) console.log(error.message);
  }
}
