from typing import List, Optional, Literal
from pydantic import BaseModel


ActionType = Literal["turn_on", "turn_off", "set_scene", "notify", "schedule"]


class Condition(BaseModel):
	type: Literal["after_time", "presence"]
	value: str


class Intent(BaseModel):
	action: ActionType
	target: str
	area: Optional[str] = None
	conditions: List[Condition] = []


class Plan(BaseModel):
	summary: str
	intent: Intent
	confirm_required: bool = False


class InterpretRequest(BaseModel):
	prompt: str


class ExecuteRequest(BaseModel):
	plan: Plan
