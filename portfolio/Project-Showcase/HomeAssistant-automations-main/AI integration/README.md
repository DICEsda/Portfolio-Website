# Home Assistant — AI Integration (Prototype)

Minimal FastAPI service that turns natural-language prompts into Home Assistant actions.

Setup
- Python 3.10+
- Install: `python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r "AI integration"\requirements.txt`
- Create `.env` in "AI integration" with `HA_BASE_URL`, `HA_TOKEN` (optional `OPENAI_API_KEY`)

Run
- `uvicorn ai_integration.main:app --host 0.0.0.0 --port 8089 --reload`

Test
- `curl -X POST http://localhost:8089/interpret -H "Content-Type: application/json" -d '{"prompt":"Turn on the hallway light if it''s after 7 PM and someone is home"}'`
