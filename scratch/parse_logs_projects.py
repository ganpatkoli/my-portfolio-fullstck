import json

logs_path = r"C:\Users\thega\.gemini\antigravity-ide\brain\c15b8776-3fe5-4ac4-ab1f-fdf5a6420293\.system_generated\logs\transcript.jsonl"

found_steps = []
with open(logs_path, 'r', encoding='utf-8') as f:
    for line_idx, line in enumerate(f):
        if "ProjectsSection" in line:
            data = json.loads(line)
            found_steps.append({
                "line_num": line_idx,
                "step_index": data.get("step_index"),
                "type": data.get("type"),
                "len": len(str(data.get("content", "")))
            })

with open("scratch/found_projects_steps.json", "w", encoding="utf-8") as out:
    json.dump(found_steps, out, indent=2)

print(f"Found steps: {found_steps}")
