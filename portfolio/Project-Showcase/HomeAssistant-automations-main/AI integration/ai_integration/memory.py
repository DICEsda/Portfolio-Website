import json
from pathlib import Path
from typing import Optional, Dict, Any


class DeviceMemory:
	def __init__(self, path: Path):
		self.path = path
		self.data: Dict[str, Any] = {"devices": {}, "areas": {}}
		self.load()

	def load(self):
		if self.path.exists():
			try:
				self.data = json.loads(self.path.read_text(encoding="utf-8"))
			except Exception:
				pass

	def save(self):
		self.path.parent.mkdir(parents=True, exist_ok=True)
		self.path.write_text(json.dumps(self.data, indent=2), encoding="utf-8")

	def resolve_device(self, name: str) -> Optional[str]:
		name_norm = name.strip().lower()
		for k, v in self.data.get("devices", {}).items():
			if k.lower() == name_norm:
				return v
		return None

	def resolve_area(self, name: str) -> Optional[str]:
		name_norm = name.strip().lower()
		for k, v in self.data.get("areas", {}).items():
			if k.lower() == name_norm:
				return v
		return None

	def get_presence_entity(self) -> str:
		return self.data.get("presence_entity", "group.family")
