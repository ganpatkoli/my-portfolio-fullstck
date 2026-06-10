import json
import os

logs_path = r"C:\Users\thega\.gemini\antigravity-ide\brain\c15b8776-3fe5-4ac4-ab1f-fdf5a6420293\.system_generated\logs\transcript.jsonl"

if not os.path.exists(logs_path):
    print("Logs file not found at:", logs_path)
    exit(1)

with open(logs_path, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        try:
            data = json.loads(line)
        except Exception as e:
            print(f"Error decoding line {idx}: {e}")
            continue
        
        step_index = data.get("step_index", idx)
        stype = data.get("type", "")
        content = data.get("content", "")
        tool_calls = data.get("tool_calls", [])
        
        # Check if the tool calls read or write ProjectsSection.tsx
        for tc in tool_calls:
            name = tc.get("name")
            args = tc.get("args", {})
            if isinstance(args, str):
                try:
                    args = json.loads(args)
                except:
                    pass
            
            target_file = args.get("AbsolutePath") or args.get("TargetFile") or args.get("TargetPath") or ""
            if "ProjectsSection.tsx" in str(target_file):
                print(f"[Step {step_index}] Tool Call: {name} on {target_file}")
        
        # Check if response/content has file view
        if "ProjectsSection.tsx" in content and "File Path:" in content:
            print(f"[Step {step_index}] View/Content of ProjectsSection.tsx found in content")
        
        # Check if model response is writing or editing
        if "ProjectsSection.tsx" in str(tool_calls):
            print(f"[Step {step_index}] Tool call contains ProjectsSection.tsx")
