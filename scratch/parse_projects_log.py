import json

logs_path = r"C:\Users\thega\.gemini\antigravity-ide\brain\c15b8776-3fe5-4ac4-ab1f-fdf5a6420293\.system_generated\logs\transcript.jsonl"

with open(logs_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('step_index') in (1299, 1301):
            print(f"--- STEP {data.get('step_index')} ---")
            print(json.dumps(data, indent=2)[:2000])
