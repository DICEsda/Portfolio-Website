import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from .schemas import InterpretRequest, ExecuteRequest, Plan
from .parser import parse_intent
from .memory import DeviceMemory
from .ha_client import HAClient


app = FastAPI(title="HA AI Integration", version="0.1.0")
mem = DeviceMemory(Path(__file__).parent / "devices.json")
ha = HAClient()


class InterpretResponse(BaseModel):
	plan: Plan


@app.post("/interpret", response_model=InterpretResponse)
def interpret(req: InterpretRequest):
	intent = parse_intent(req.prompt)
	if not intent:
		raise HTTPException(status_code=400, detail="Could not understand the command")

	eid = mem.resolve_device(intent.target) or mem.resolve_area(intent.target)
	area = mem.resolve_area(intent.area or "") if intent.area else None

	summary = f"{intent.action} {intent.target}"
	if intent.conditions:
		conds = ", ".join([f"{c.type}={c.value}" for c in intent.conditions])
		summary += f" if {conds}"

	confirm_required = intent.action in {"turn_off"}

	plan = Plan(summary=summary, intent=intent, confirm_required=confirm_required)
	plan.__dict__["_entity_id"] = eid
	plan.__dict__["_area_id"] = area
	return {"plan": plan}


@app.post("/execute")
def execute(req: ExecuteRequest):
	plan = req.plan
	entity_id = plan.__dict__.get("_entity_id")
	presence_entity = os.getenv("HOME_PRESENCE_ENTITY", mem.get_presence_entity())

	for c in plan.intent.conditions:
		if c.type == "presence":
			if not ha.is_someone_home(presence_entity):
				raise HTTPException(status_code=412, detail="Condition failed: no one is home")

	if not entity_id:
		raise HTTPException(status_code=400, detail="Unknown device. Add it to devices memory.")

	if plan.intent.action == "turn_on":
		ha.turn_on(entity_id)
	elif plan.intent.action == "turn_off":
		ha.turn_off(entity_id)
	else:
		raise HTTPException(status_code=400, detail="Unsupported action in prototype")

	return {"status": "ok", "executed": plan.summary, "entity_id": entity_id}


@app.get("/health")
def health():
	return {"ok": True}
