import os

paths_to_search = [
    r"d:\aiagent\testing",
    r"C:\Users\thega\.gemini\antigravity-ide"
]

found = []
for p in paths_to_search:
    if os.path.exists(p):
        for root, dirs, files in os.walk(p):
            # Skip node_modules and .git
            if "node_modules" in root or ".git" in root:
                continue
            for f in files:
                if "ExperienceSection" in f or "experience" in f.lower():
                    full_path = os.path.join(root, f)
                    found.append((full_path, os.path.getsize(full_path)))

print("Found files:", found)
