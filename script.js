const apiKeyInput = document.getElementById("apiKey");
const saveKeyBtn = document.getElementById("saveKeyBtn");
const clearKeyBtn = document.getElementById("clearKeyBtn");
const resumeForm = document.getElementById("resumeForm");
const output = document.getElementById("output");
const generateBtn = document.getElementById("generateBtn");
const statusText = document.getElementById("status");

let configuredApiKey = "";

function setStatus(message) {
  statusText.textContent = message;
}

function configureKey() {
  const key = apiKeyInput.value.trim();
  if (!key) {
    setStatus("Please enter an OpenAI API key.");
    return;
  }
  configuredApiKey = key;
  setStatus("OpenAI API key configured for this session.");
}

function clearKey() {
  configuredApiKey = "";
  apiKeyInput.value = "";
  setStatus("OpenAI API key cleared.");
}

function buildPrompt(formData) {
  const fields = Object.fromEntries(formData.entries());
  return `
You are an expert resume writer.
Create a clean, professional resume in plain text using these details:

Full Name: ${fields.fullName}
Email: ${fields.email}
Phone: ${fields.phone}
Target Role: ${fields.targetRole}
Professional Summary: ${fields.summary}
Skills: ${fields.skills}
Work Experience: ${fields.experience}
Education: ${fields.education}

Rules:
- Keep it concise and impactful.
- Use sections with clear headings.
- Include achievement-focused bullet points.
  `.trim();
}

async function generateResume(event) {
  event.preventDefault();

  const apiKey = configuredApiKey || apiKeyInput.value.trim();
  if (!apiKey) {
    setStatus("Please configure your OpenAI API key first.");
    return;
  }

  const formData = new FormData(resumeForm);
  const prompt = buildPrompt(formData);

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";
  output.textContent = "Generating resume...";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message =
        errorData?.error?.message || "Failed to generate resume. Check your API key.";
      throw new Error(message);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new Error("OpenAI did not return generated content.");
    }

    output.textContent = text;
    setStatus("Resume generated successfully.");
  } catch (error) {
    output.textContent = `Error: ${error.message}`;
    setStatus("Failed to generate resume.");
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Resume";
  }
}

saveKeyBtn.addEventListener("click", configureKey);
clearKeyBtn.addEventListener("click", clearKey);
resumeForm.addEventListener("submit", generateResume);
