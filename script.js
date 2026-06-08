const STORAGE_KEY = "openai_api_key";

const apiKeyInput = document.getElementById("apiKey");
const saveKeyBtn = document.getElementById("saveKeyBtn");
const clearKeyBtn = document.getElementById("clearKeyBtn");
const resumeForm = document.getElementById("resumeForm");
const output = document.getElementById("output");
const generateBtn = document.getElementById("generateBtn");

function loadSavedKey() {
  const savedKey = localStorage.getItem(STORAGE_KEY);
  if (savedKey) {
    apiKeyInput.value = savedKey;
  }
}

function saveKey() {
  const key = apiKeyInput.value.trim();
  if (!key) {
    alert("Please enter an OpenAI API key.");
    return;
  }
  localStorage.setItem(STORAGE_KEY, key);
  alert("OpenAI API key saved.");
}

function clearKey() {
  localStorage.removeItem(STORAGE_KEY);
  apiKeyInput.value = "";
  alert("OpenAI API key cleared.");
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

  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    alert("Please configure your OpenAI API key first.");
    return;
  }

  const formData = new FormData(resumeForm);
  const prompt = buildPrompt(formData);

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";
  output.textContent = "Generating resume...";

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message =
        errorData?.error?.message || "Failed to generate resume. Check your API key.";
      throw new Error(message);
    }

    const data = await response.json();
    const text = data?.output_text?.trim();
    if (!text) {
      throw new Error("OpenAI did not return generated content.");
    }

    output.textContent = text;
  } catch (error) {
    output.textContent = `Error: ${error.message}`;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Resume";
  }
}

saveKeyBtn.addEventListener("click", saveKey);
clearKeyBtn.addEventListener("click", clearKey);
resumeForm.addEventListener("submit", generateResume);
loadSavedKey();
