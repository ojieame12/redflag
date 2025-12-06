
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const SYSTEM_PROMPT = `You are RedFlag, an expert relationship conversation analyst. 
Analyze conversations for concerning patterns while being balanced and fair. You must detect BOTH toxic "Red Flags" and healthy "Green Flags".

## Your Four Outputs

### 1. RED FLAGS 🚩
Detect these specific patterns: love bombing, future faking, gaslighting, breadcrumbing, negging, stonewalling, blame shifting, controlling language.

### 2. GREEN FLAGS 💚
Detect healthy patterns: respecting boundaries, direct communication, accountability, empathy, consistency, support.

### 3. TOXICITY ASSESSMENT
Score 1-10. Verdicts: "healthy", "minor_concerns", "concerning", "likely_toxic", "toxic"

### 4. ATTACHMENT STYLE
Identify PRIMARY style: Secure, Anxious-Preoccupied, Dismissive-Avoidant, Fearful-Avoidant

## Required JSON Output Format
Return ONLY valid JSON with this exact structure:
{
  "red_flags": [{ "type": "string", "evidence": "string", "explanation": "string" }],
  "green_flags": [{ "type": "string", "evidence": "string", "explanation": "string" }],
  "toxicity": { "score": number, "verdict": "string", "summary": "string" },
  "attachment_style": { "primary": "string", "confidence": "string", "indicators": ["string"], "explanation": "string" }
}`;

serve(async (req) => {
  // CORS Helper
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }

  try {
    // 1. Verify Auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing Authorization header');

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Unauthorized');

    // 2. Parse Input
    const { base64, type } = await req.json();

    // 3. Call Gemini (Server-Side)
    // Using gemini-3-pro-preview as verified
    let parts;
    if (type === 'image') {
      parts = [
        { text: SYSTEM_PROMPT },
        { inline_data: { mime_type: "image/jpeg", data: base64 } }
      ];
    } else if (type === 'audio') {
      parts = [
        { text: SYSTEM_PROMPT },
        { inline_data: { mime_type: "audio/m4a", data: base64 } }
      ];
    } else {
      parts = [
        { text: SYSTEM_PROMPT },
        { text: `\n\n## Conversation to analyze:\n${base64}` }
      ];
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: parts }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      }
    );

    const geminiData = await geminiResponse.json();

    if (!geminiData.candidates || !geminiData.candidates[0].content) {
      console.error("Gemini Error:", JSON.stringify(geminiData));
      throw new Error('Gemini API returned invalid response');
    }

    const resultText = geminiData.candidates[0].content.parts[0].text;
    const result = JSON.parse(resultText);

    // 4. Save to Database (Server-Side)
    const { data: savedAnalysis, error: dbError } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        input_type: type,
        red_flags: result.red_flags,
        green_flags: result.green_flags,
        toxicity_score: result.toxicity.score,
        toxicity_verdict: result.toxicity.verdict,
        toxicity_summary: result.toxicity.summary,
        attachment_style: result.attachment_style.primary,
        attachment_explanation: result.attachment_style.explanation,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // 5. Increment Usage
    await supabase.rpc('increment_usage', { x_user_id: user.id });

    return new Response(JSON.stringify(savedAnalysis), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});
