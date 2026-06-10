import json
import re

logs_path = r"C:\Users\thega\.gemini\antigravity-ide\brain\c15b8776-3fe5-4ac4-ab1f-fdf5a6420293\.system_generated\logs\transcript.jsonl"

steps_to_extract = [1013, 1048, 1050, 1052, 1054, 1165, 1204]
lines_dict = {}

with open(logs_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        step = data.get('step_index')
        if step in steps_to_extract or (data.get('type') == 'VIEW_FILE' and 'ProjectsSection.tsx' in str(data.get('content', ''))):
            content = data.get('content', '')
            if "Showing lines" in content:
                # Extract line numbers and code
                # e.g., "1: import ..."
                matches = re.findall(r'^(\d+):\s(.*)$', content, re.MULTILINE)
                for line_num_str, code_line in matches:
                    line_num = int(line_num_str)
                    lines_dict[line_num] = code_line

# Print the recovered lines summary
sorted_lines = sorted(lines_dict.keys())
print(f"Recovered lines: {len(sorted_lines)} (range {sorted_lines[0] if sorted_lines else None} to {sorted_lines[-1] if sorted_lines else None})")

# Write to reconstructed file
if sorted_lines:
    reconstructed_content = []
    # Fill in any missing lines with empty space so indices match
    max_line = max(sorted_lines)
    for i in range(1, max_line + 1):
        reconstructed_content.append(lines_dict.get(i, ""))
    
    with open("scratch/reconstructed_projects.tsx", "w", encoding="utf-8") as out:
        out.write("\n".join(reconstructed_content))
    print("Successfully saved reconstructed file to scratch/reconstructed_projects.tsx")
else:
    print("No lines recovered!")
