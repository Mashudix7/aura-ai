const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_KEY = process.env.OPENROUTER_API_KEY;
const URL = "https://openrouter.ai/api/v1/chat/completions";

async function testKey() {
    console.log("Testing API Key:", API_KEY?.substring(0, 10) + "...");
    try {
        const res = await fetch(URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://localhost:3000",
                "X-Title": "AiAura",
            },
            body: JSON.stringify({
                model: "stepfun/step-3.5-flash:free",
                messages: [{ role: "user", content: "hi" }],
            }),
        });
        const data = await res.json();
        console.log("Response Status:", res.status);
        console.log("Response Data:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Test failed:", err);
    }
}

testKey();
