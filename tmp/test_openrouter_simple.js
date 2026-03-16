const API_KEY = "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";
const URL = "https://openrouter.ai/api/v1/chat/completions";

async function testKey() {
    console.log("Testing hardcoded API Key...");
    try {
        const res = await fetch(URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://localhost:3000",
                "X-Title": "AiAura",
            },
            body: JSON.stringify({
                model: "stepfun/step-3.5-flash:free",
                messages: [{ role: "user", content: "hi" }],
            }),
        });
        const status = res.status;
        const text = await res.text();
        console.log("Response Status:", status);
        console.log("Response Text:", text);
    } catch (err) {
        console.error("Test failed:", err);
    }
}

testKey();
