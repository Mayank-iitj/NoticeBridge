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

    const systemPrompt = `You are a legal aid assistant helping a user draft a letter in response to an official notice.
Type of letter requested: ${letterType}

Context from notice:
Type: ${noticeResult.notice_type}
Issuer: ${noticeResult.issuer || "Unknown"}
Summary: ${noticeResult.summary_plain}
Deadline: ${noticeResult.deadline.raw_text || "Unknown"}
Amount Due: ${noticeResult.amount_due?.value ? noticeResult.amount_due.currency + noticeResult.amount_due.value : "Unknown"}

Instructions:
1. Draft a formal, polite, and clear letter.
2. Use EXACTLY these placeholders for user details: [YOUR NAME], [YOUR ADDRESS], [YOUR PHONE NUMBER], [YOUR ACCOUNT/CASE NUMBER], [DATE].
3. DO NOT invent any facts. Only use the context provided.
4. Keep it concise.
5. Do not include any pre-text or post-text, JUST the letter itself.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      max_tokens: 1000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Please draft the letter now." }
      ]
    });

    const letterContent = response.choices[0].message.content || "";

    return NextResponse.json({ letter: letterContent });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
