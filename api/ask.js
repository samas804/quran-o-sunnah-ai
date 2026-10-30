// Vercel serverless function: /api/ask
// Keep OPENAI_API_KEY in Vercel Environment Variables. Never put it in browser code.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "صرف POST درخواست کی اجازت ہے۔" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "AI سروس ابھی ترتیب نہیں دی گئی۔" });
  }

  const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
  if (!question || question.length > 1200) {
    return res.status(400).json({ error: "براہِ کرم 1 سے 1200 حروف کے اندر سوال لکھیں۔" });
  }

  const instructions = `
آپ قرآن و سنت کے موضوعات پر اردو میں محتاط تعلیمی معاون ہیں۔
اہم اصول:
1) قرآن یا حدیث کا عربی متن، ترجمہ، سورت/آیت نمبر، کتاب یا حدیث نمبر کبھی خود سے نہ گھڑیں۔
2) اس نظام کے پاس فی الحال کوئی تصدیق شدہ مکمل حدیث ڈیٹابیس منسلک نہیں۔ اس لیے کسی مخصوص روایت کی صحت، حدیث نمبر، فقہی فتویٰ یا اختلافی مسئلے پر قطعی دعویٰ نہ کریں۔
3) اگر مستند حوالہ یقینی طور پر معلوم نہ ہو تو صاف کہیں کہ حوالہ کی تصدیق نہیں کر سکتے، اور صارف کو اہل علم یا اصل مستند کتاب سے رجوع کرنے کا کہیں۔
4) عام اسلامی معلومات کو مختصر، نرم اور آسان اردو میں سمجھائیں۔ سوال انگریزی میں ہو تو انگریزی میں جواب دیں۔
5) ذاتی فتویٰ، طبی/قانونی فیصلے یا فرقہ وارانہ نفرت انگیزی نہ کریں۔
6) واضح رکھیں کہ آپ AI ہیں اور آپ کا جواب عالمِ دین کا متبادل نہیں۔
`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.5",
        instructions,
        input: question,
        max_output_tokens: 700
      }),
      signal: AbortSignal.timeout(25000)
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI API error:", response.status, data?.error?.type || "unknown");
      return res.status(502).json({ error: "جواب حاصل نہیں ہو سکا۔ کچھ دیر بعد دوبارہ کوشش کریں۔" });
    }

    const answer = (data.output || [])
      .filter(item => item.type === "message")
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n")
      .trim();

    if (!answer) {
      return res.status(502).json({ error: "AI سے قابلِ مطالعہ جواب موصول نہیں ہوا۔" });
    }

    return res.status(200).json({
      answer,
      notice: "یہ AI کی تعلیمی رہنمائی ہے، مستند عالم کے فتویٰ کا متبادل نہیں۔"
    });
  } catch (error) {
    console.error("AI request failed:", error.name || "Error");
    return res.status(504).json({ error: "درخواست میں وقت زیادہ لگ گیا۔ دوبارہ کوشش کریں۔" });
  }
}
