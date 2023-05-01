import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1>Workout Generator</h1>
      <div>
        Here is where all the fields will go:
        <div>Radio buttons</div>
        <div>Input section for more details</div>
        <button>Submit button</button>
      </div>
      <div>Here is where the output will go</div>
    </main>
  );
}
