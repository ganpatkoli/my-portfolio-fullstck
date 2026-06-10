import json
import re

logs_path = r"C:\Users\thega\.gemini\antigravity-ide\brain\c15b8776-3fe5-4ac4-ab1f-fdf5a6420293\.system_generated\logs\transcript.jsonl"

lines_dict = {}

with open(logs_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        content = data.get('content', '')
        if not content:
            continue
        # Verify it's a VIEW_FILE of ProjectsSection.tsx
        if "File Path: `file:///d:/aiagent/testing/src/components/ProjectsSection.tsx`" in content:
            # Extract line numbers and code
            matches = re.findall(r'^(\d+):\s(.*)$', content, re.MULTILINE)
            for line_num_str, code_line in matches:
                line_num = int(line_num_str)
                lines_dict[line_num] = code_line

sorted_lines = sorted(lines_dict.keys())
print(f"Recovered lines: {len(sorted_lines)} (range {sorted_lines[0] if sorted_lines else None} to {sorted_lines[-1] if sorted_lines else None})")

if sorted_lines:
    reconstructed_content = []
    max_line = max(sorted_lines)
    for i in range(1, max_line + 1):
        reconstructed_content.append(lines_dict.get(i, ""))
    
    with open("scratch/reconstructed_projects_precise.tsx", "w", encoding="utf-8") as out:
        out.write("\n".join(reconstructed_content))
    print("Saved precise reconstruction to scratch/reconstructed_projects_precise.tsx")
else:
    print("No lines recovered!")
