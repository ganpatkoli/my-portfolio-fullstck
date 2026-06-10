import re

file_path = "d:/aiagent/testing/src/components/HeroSection.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove unused imports
content = re.sub(r'Play,\s*', '', content)
content = re.sub(r'Check,\s*', '', content)
content = re.sub(r'UserCheck,\s*', '', content)
content = re.sub(r'RefreshCw,\s*', '', content)
content = re.sub(r'Sliders,\s*', '', content)
content = re.sub(r'Layers,\s*', '', content)
content = re.sub(r',\s*} from "lucide-react";', '} from "lucide-react";', content)

# Remove state variables (multiline regex replacements or simple string matching)
# To be safe and avoid breaking the file, I'll remove them by line matching.

lines = content.split('\n')
new_lines = []

skip = False
for line in lines:
    # State vars
    if "const [activeTab" in line: continue
    if "const [chartTheme" in line: continue
    if "const [chartType" in line: continue
    if "const [indicators" in line: continue
    if "const [priceChange" in line: continue
    if "const [tradeLogs" in line: continue
    if "const [copyActive" in line: continue
    if "const [simulationTriggered" in line: continue
    
    # functions
    if "const triggerSimulation" in line:
        skip = True
        continue
    if skip and "};" in line:
        skip = False
        continue
    if skip:
        continue

    # data arrays
    if "const baseCandles" in line:
        skip = True
        continue
    if skip and "];" in line:
        skip = False
        continue
    
    if "const activeLastVal" in line: continue
    if "const activeLastHigh" in line: continue
    if "const activeLastLow" in line: continue
    
    if "const candles = [" in line:
        skip = True
        continue
    
    if "const themeColors = {" in line:
        skip = True
        continue
    if skip and "};" in line:
        skip = False
        continue
        
    if "const selectedColor" in line: continue
    
    new_lines.append(line)

with open(file_path, "w", encoding="utf-8") as f:
    f.write('\n'.join(new_lines))
    
print("Cleanup done")
