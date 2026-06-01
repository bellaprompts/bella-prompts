exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
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
        system: `You are Bella Prompts. Respond ONLY with a valid JSON object, no markdown, no backticks, no explanation. Use exactly this structure:
{"title":"short title","beginner_prompt":"simple prompt under 50 words","advanced_prompt":"detailed prompt up to 150 words","recommended_tool":"tool name","tool_reason":"one sentence why","tool_url":"https://tool-website.com","mistakes":["Title. explanation","Title. explanation","Title. explanation"],"try_next":[{"title":"title","desc":"description"},{"title":"title","desc":"description"},{"title":"title","desc":"description"}]}`,
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
  } catch(err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
