// /api/generate-plan.js — Vercel serverless function
// Calls Claude Opus 4.7 to generate a personalized SAT plan
// API key lives in Vercel environment variable: ANTHROPIC_API_KEY

export default async function handler(req, res) {
  // CORS — allow requests from your domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { parentName, currentScore, targetScore, weeksUntilTest, hoursPerWeek, scholarship, language } = req.body || {};

  if (!parentName || !currentScore || !targetScore) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const gap = Math.max(0, targetScore - currentScore);
  const totalHours = weeksUntilTest * hoursPerWeek;
  const isSpanish = language === 'es';

  const systemPrompt = `You are Sebastian Meza, a UCF Industrial Engineering junior who scored 1490 on the SAT and earned a $30,000 Provost Scholarship. You now run Meza Scholars, helping South Florida families — especially Hispanic immigrant families in Miami and Broward — qualify for Florida's Bright Futures scholarship.

Your audience: Parents who know the SAT matters but, because they navigated college from outside the US system, often don't know exactly how it works or how much money is on the table. They are not lazy or uninformed. They are doing the best they can in a system nobody explained to them. Your job is to translate the SAT into clear, actionable steps and ease their financial stress.

Your tone:
- Warm and encouraging, like a mentor who genuinely cares
- Conversational, like a smart older brother — not a salesperson
- Direct and specific. No fluff. Concrete next steps.
- Acknowledge the financial weight of college without being heavy-handed
- Never patronizing about their immigration status — just helpful

Critical rules:
- Address the parent by their name once at the start
- Reference their child's specific score gap and timeline — never generic advice
- Give 3 truly specific priorities based on their exact gap, weeks, and study hours
- If timeline is tight (gap > 200 with under 8 weeks or under 5 hrs/week), be honest but encouraging
- If timeline is comfortable, build confidence
- Never mention competitor tutors or AI tools you haven't built
- End with a soft invitation to book a call — don't be pushy
- Keep total response under 300 words
- Output as clean HTML using <h3>, <p>, <ul>, <li>, <strong> tags only
- Do NOT include any preamble, code blocks, or markdown — just the HTML body

${isSpanish ? 'CRITICAL: Write your entire response in natural, warm Spanish (the way a Cuban or Colombian would speak — not formal Spanish from Spain). Use "tu" not "usted".' : 'Write in natural conversational English.'}`;

  const userPrompt = `Build a personalized SAT plan for this family:

Parent's name: ${parentName}
Child's current SAT: ${currentScore}
Target score: ${targetScore} (${targetScore === 1330 ? 'Florida Academic Scholars — $22,000 scholarship' : 'Florida Medallion Scholars — $18,000 scholarship'})
Points to gain: ${gap}
Weeks until test: ${weeksUntilTest}
Study hours per week: ${hoursPerWeek}
Total study hours available: ${totalHours}

Structure the response as 3 sections with <h3> headers:

1. **A short opening read on their situation** (2-3 sentences). Address ${parentName} by name. Be honest about whether the timeline is comfortable, tight but doable, or aggressive. Reference the exact scholarship dollar amount at stake.

2. **The 3 specific priorities for their child** — based on their exact gap and timeline. For small gaps (<100): focus on test strategy and pacing. For medium gaps (100-200): topic-specific drilling. For large gaps (200+): foundation building plus strategic test-taking. Make each priority concrete and actionable.

3. **What to do this week** — one specific thing they can do in the next 7 days to start.

End with a single warm sentence inviting them to book a free call if they want a fully customized week-by-week plan.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-7',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);
      return res.status(500).json({ error: 'AI generation failed' });
    }

    const data = await response.json();
    const html = data.content?.[0]?.text || '';

    return res.status(200).json({ html });
  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
