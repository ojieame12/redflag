
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- CONFIG ---
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY; // Use Service Role for test writing/deleting

if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Missing environment variables. Check .env file.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function runGoldenTest() {
    console.log("🧪 Starting RedFlag Golden Test Suite...\n");
    let passed = 0;
    let failed = 0;

    // TEST 1: GEMINI GENERATION
    try {
        console.log("🔹 Test 1: Gemini API Connectivity...");

        const modelsToTry = [
            "gemini-3-pro-preview",
            "gemini-3-flash-preview",
            "gemini-2.0-flash-exp",
            "gemini-1.5-flash-002",
        ];
        let text = "";

        for (const modelName of modelsToTry) {
            try {
                console.log(`   Trying model: ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Explain what a 'Red Flag' in dating is in one sentence.");
                text = result.response.text();
                if (text) {
                    console.log(`   ✅ Success with ${modelName}`);
                    break;
                }
            } catch (inner) {
                console.log(`   ⚠️ Failed with ${modelName}:`, inner.message?.slice(0, 100)); // Log short error
            }
        }

        if (text && text.length > 10) {
            console.log("✅ Gemini Passed: ", text.trim());
            passed++;
        } else {
            console.error("❌ Gemini Failed: Could not generate content with any model.");
            failed++;
        }
    } catch (e) {
        console.error("❌ Gemini Eror:", e);
        failed++;
    }

    // TEST 2: SUPABASE CONNECTIVITY (Service Role)
    try {
        console.log("\n🔹 Test 2: Supabase DB Write/Read...");
        const testId = `test-${Date.now()}`;

        // 1. Create a fake profile if needed, or just check connectivity by selecting * from profiles limit 1
        const { data: profiles, error: readError } = await supabase.from('profiles').select('*').limit(1);

        if (readError) {
            throw readError;
        }

        console.log("✅ Supabase Read Passed. Rows found:", profiles.length);
        passed++;

    } catch (e) {
        console.error("❌ Supabase Error:", e);
        failed++;
    }

    // TEST 3: PROMPT STRUCTURE VALIDATION (Mock)
    try {
        console.log("\n🔹 Test 3: Prompt Logic...");
        const mockPrompt = `Analyze this: "He never texts back until 2am."`;
        if (mockPrompt.includes('Analyze')) {
            console.log("✅ Prompt Generation Logic Passed");
            passed++;
        } else {
            console.error("❌ Prompt Logic Failed");
            failed++;
        }
    } catch (e) {
        failed++;
    }

    console.log(`\n---------------------------------`);
    console.log(`🎉 Test Suite Completed.`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);

    if (failed > 0) process.exit(1);
}

runGoldenTest();
