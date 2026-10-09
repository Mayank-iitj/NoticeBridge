import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const rawKey = process.env.OPENAI_API_KEY || "missing";
const openai = new OpenAI({
  apiKey: rawKey.replace(/\s/g, ""),
});

export async function POST(req: NextRequest) {
  try {
    const { noticeResult, letterType } = await req.json();

    if (!noticeResult || !letterType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // --- Mock for Zero Setup Demo ---
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_api_key_here") {
      // Mock response
      const mockLetter = `[YOUR NAME]
[YOUR ADDRESS]
[YOUR PHONE NUMBER]

[DATE]

${noticeResult.issuer || "To Whom It May Concern"}

RE: ${letterType} for Notice / Account [YOUR ACCOUNT/CASE NUMBER]

Dear ${noticeResult.issuer || "Sir/Madam"},

I am writing in response to the ${noticeResult.notice_type} notice I received. I am requesting a ${letterType.toLowerCase()} regarding this matter. 

Please let me know what the next steps are and if any further documentation is required from my end.

Sincerely,

[YOUR NAME]`;
      return NextResponse.json({ letter: mockLetter });
    }

    // --- DETERMINISTIC FALLBACK (No LLM Required) ---
    const letterContent = `[YOUR NAME]
[YOUR ADDRESS]
[YOUR PHONE NUMBER]

[DATE]

${noticeResult.issuer || "To Whom It May Concern"}

RE: ${letterType} for Notice / Account [YOUR ACCOUNT/CASE NUMBER]

Dear ${noticeResult.issuer || "Sir/Madam"},

I am writing in response to the ${noticeResult.notice_type} notice I received. I am requesting a ${letterType.toLowerCase()} regarding this matter. 

Please let me know what the next steps are and if any further documentation is required from my end.

Sincerely,

[YOUR NAME]`;

    return NextResponse.json({ letter: letterContent });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
