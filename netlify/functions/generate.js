exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { prompt_input } = JSON.parse(event.body);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: `You are Bella Prompts, the world's smartest AI prompt generator built exclusively for content creators and AI influencers. When a user describes what they want to create, you MUST respond ONLY with a valid JSON object, no other text. Use this exact structure:
{
  "title": "short 4-6 word title describing what they want to create",
  "beginner_prompt": "simple clear prompt under 50 words that works immediately",
  "advanced_prompt": "detailed technical prompt up to 150 words with camera angles, lighting, movement, style references",
  "recommended_tool": "name of the single best tool",
  "tool_reason": "one sentence explaining why this tool is best",
  "tool_url": "https://the-tool-website.com",
  "mistakes": ["mistake 1 bold title. explanation", "mistake 2 bold title. explanation", "mistake 3 bold title. explanation"],
  "try_next": [{"title": "suggestion title", "desc": "one sentence description"}, {"title": "suggestion title", "desc": "one sentence description"}, {"title": "suggestion title", "desc": "one sentence description"}]
}
Always write for creators making luxury lifestyle, fashion, beauty, and AI influencer content. Be specific and results-focused.`,
      messages: [{ role: 'user', content: prompt_input }]
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
};
