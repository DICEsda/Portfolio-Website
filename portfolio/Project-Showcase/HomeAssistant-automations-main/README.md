# HomeAssistant Automations — Natural Language Interface (Ongoing)

This project started as a collection of classic Home Assistant YAML automations and is evolving into a natural language control layer. Instead of creating many one‑off automations, you can type or say requests like:

“Turn on the hallway light if it’s after 7 PM and someone is home.”

The system parses the intent and executes via Home Assistant’s API.

## Architecture
- LangChain → Orchestrates parsing, routing, and tool selection
- OpenAI API → Extracts intents and generates confirmations/responses
- Vector DB (optional) → Stores devices/areas/routines to ground the model
- Home Assistant API → Executes actions (REST/WebSocket)
- Frontend → Conversation/assist card + custom dashboard panel in HA

## Components
- NL Orchestrator (LangChain): chains and tool routing for entity/condition extraction
- LLM Intent + Responses: structured outputs with safety prompts and validation
- Vector Memory: embeddings of devices and user‑named routines for disambiguation
- Execution Layer: FastAPI service that calls HA with allow‑listed tools and confirmations
- Dashboard: UI to type/speak prompts and view confirmations/results

## Status
- AI orchestration is being rolled out incrementally and is not yet finished.
- Legacy YAML automations remain as a reliable fallback.

## Repository
GitHub: https://github.com/DICEsda/HomeAssistant-automations

