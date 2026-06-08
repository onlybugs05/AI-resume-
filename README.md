# AI Resume Builder

A simple web app that creates a resume draft using OpenAI.

## Features
- Enter resume details (summary, skills, experience, education, etc.)
- Configure your OpenAI API key in the UI
- Configure/clear API key for the current page session
- Generate a structured resume draft with one click

## Run
Because this is a static app, you can run it with any local static server.

Example with Python:

```bash
cd path/to/AI-resume-
python3 -m http.server 8000
```

Then open:

`http://localhost:8000/index.html`

## Notes
- The OpenAI API key is kept only in memory for the current page session.
- Do not share your API key publicly.