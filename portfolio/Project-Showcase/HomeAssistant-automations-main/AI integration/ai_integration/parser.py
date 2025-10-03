import os
import re
from typing import Optional

from .schemas import Intent, Condition


def rule_based_parse(prompt: str) -> Optional[Intent]:
	p = prompt.strip().lower()
	action: Optional[str] = None
	if re.search(r"\bturn on\b|\bswitch on\b|\benable\b", p):
		action = "turn_on"
	elif re.search(r"\bturn off\b|\bswitch off\b|\bdisable\b", p):
		action = "turn_off"

	target = None
	m = re.search(r"(hallway|kitchen|bedroom|living|bathroom|garage)[ -]?(light|lamp|scene)", p)
	if m:
		target = f"{m.group(1)} {m.group(2)}".strip()
	else:
		m2 = re.search(r"([a-z\-\s]+?)\s+(light|lamp|scene)", p)
		if m2:
			target = f"{m2.group(1).strip()} {m2.group(2)}"

	if not action or not target:
		return None

	conditions = []
	tm = re.search(r"after\s+(\d{1,2})\s*(am|pm)?|after\s+(\d{1,2}:\d{2})", p)
	if tm:
		if tm.group(1):
			hour = int(tm.group(1))
			if tm.group(2) and tm.group(2) == "pm" and hour < 12:
				hour += 12
			value = f"{hour:02d}:00"
		else:
			value = tm.group(3)
		conditions.append(Condition(type="after_time", value=value))

	if re.search(r"someone is home|anyone home|if.*home", p):
		conditions.append(Condition(type="presence", value="home"))

	return Intent(action=action, target=target, area=None, conditions=conditions)


def llm_parse(prompt: str) -> Optional[Intent]:
	if not os.getenv("OPENAI_API_KEY"):
		return None
	return None


def parse_intent(prompt: str) -> Optional[Intent]:
	return rule_based_parse(prompt) or llm_parse(prompt)
