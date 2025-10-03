import requests

BASE = "http://localhost:8089"

prompt = "Turn on the hallway light if it's after 7 and someone is home"

res = requests.post(f"{BASE}/interpret", json={"prompt": prompt})
print("interpret:", res.status_code, res.json())

plan = res.json()["plan"]
res2 = requests.post(f"{BASE}/execute", json={"plan": plan})
print("execute:", res2.status_code, res2.json())
