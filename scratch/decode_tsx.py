import json

logs_path = r"C:\Users\thega\.gemini\antigravity-ide\brain\c15b8776-3fe5-4ac4-ab1f-fdf5a6420293\.system_generated\logs\transcript.jsonl"

with open(logs_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('step_index') == 399:
            for call in data.get('tool_calls', []):
                if call.get('name') == 'write_to_file':
                    content = call['args']['CodeContent']
                    # content is a python string. If it was stored double-escaped, let's parse it if it is JSON
                    if content.startswith('"') and content.endswith('"'):
                        try:
                            content = json.loads(content)
                        except Exception as e:
                            print("Failed to loads content:", e)
                    
                    # Also double check if we need to evaluate string escape sequences
                    # If it has literal '\n' and '\"', let's decode it
                    if '\\n' in content or '\\"' in content:
                        # We can use codecs escape decoding
                        import codecs
                        content = codecs.escape_decode(bytes(content, "utf-8"))[0].decode("utf-8")
                        
                    with open(r"d:\aiagent\testing\src\components\ExperienceSection.tsx", "w", encoding="utf-8") as out:
                        out.write(content)
                    print("Successfully wrote decoded TSX to ExperienceSection.tsx!")
