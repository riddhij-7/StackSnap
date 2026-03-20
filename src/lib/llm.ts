import Anthropic from '@anthropic-ai/sdk'
import type { DetectedTech } from './fingerprint'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface LLMSummary {
  architecture: string    // how the stack fits together
  suggestions: string[]   // 2-3 improvement ideas
  concerns: string[]      // security or performance flags
}

export async function analyzeStackWithLLM(
  url: string,
  detected: DetectedTech[]
): Promise<LLMSummary> {

  // Format the detected stack into a readable list for the prompt
  const stackList = detected
    .map(t => `- ${t.name} (${t.category}, ${t.confidence} confidence)`)
    .join('\n')

  const prompt = `You are a software architecture expert analyzing the tech stack of a website.

Website: ${url}
Detected technologies:
${stackList}

Respond ONLY with a valid JSON object in exactly this shape:
{
  "architecture": "2-3 sentence plain English explanation of how this stack fits together and what kind of product/team this suggests",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "concerns": ["concern 1", "concern 2"]
}

Rules:
- architecture: be specific about WHY these technologies work together, not just what they are
- suggestions: practical improvements a developer could actually act on
- concerns: real security or performance issues, not generic advice
- If detected stack is too small to analyze meaningfully, still give your best assessment
- No markdown, no extra text, just the JSON object`

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  // Extract the text content from Claude's response
  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from LLM')
  }

  // Parse the JSON 
  try {
    return JSON.parse(content.text) as LLMSummary
  } catch {
    // Fallback if parsing fails for any reason
    return {
      architecture: content.text,
      suggestions: [],
      concerns: [],
    }
  }
}