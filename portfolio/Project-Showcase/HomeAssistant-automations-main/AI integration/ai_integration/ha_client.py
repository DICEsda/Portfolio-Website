import os
from typing import Optional
import requests


class HAClient:
	def __init__(self, base_url: Optional[str] = None, token: Optional[str] = None):
		self.base_url = (base_url or os.getenv("HA_BASE_URL", "http://homeassistant.local:8123")).rstrip("/")
		self.token = token or os.getenv("HA_TOKEN", "")
		self.session = requests.Session()
		self.session.headers.update({
			"Authorization": f"Bearer {self.token}",
			"Content-Type": "application/json",
		})

	def _post(self, path: str, json=None):
		url = f"{self.base_url}{path}"
		r = self.session.post(url, json=json, timeout=10)
		r.raise_for_status()
		return r.json() if r.text else {}

	def call_service(self, domain: str, service: str, entity_id: str):
		return self._post(f"/api/services/{domain}/{service}", json={"entity_id": entity_id})

	def turn_on(self, entity_id: str):
		domain = entity_id.split(".")[0]
		return self.call_service(domain, "turn_on", entity_id)

	def turn_off(self, entity_id: str):
		domain = entity_id.split(".")[0]
		return self.call_service(domain, "turn_off", entity_id)

	def is_someone_home(self, presence_entity: str) -> bool:
		url = f"{self.base_url}/api/states/{presence_entity}"
		r = self.session.get(url, timeout=10)
		if r.status_code != 200:
			return False
		state = r.json().get("state", "unknown")
		return state == "home" or state == "on"
