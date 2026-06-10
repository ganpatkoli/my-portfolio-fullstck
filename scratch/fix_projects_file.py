import re

precise_path = r"d:\aiagent\testing\scratch\reconstructed_projects_precise.tsx"

with open(precise_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Clean up and construct
fixed_lines = []

# 1. Add React import at the top
fixed_lines.append('import { useEffect, useId, useRef, useState } from "react";')

# We process lines from the precise reconstruction up to line 432
for idx in range(1, 432):
    line_num = idx + 1 # 1-based index in the file (since lines is 0-indexed and line 1 is empty)
    if line_num > len(lines):
        break
    content = lines[idx].rstrip("\n")
    
    # 2. Fix expanded card close button gap (lines 187 to 201)
    if line_num == 188:
        fixed_lines.append(content) # motion.button
        fixed_lines.append('                  key={`close-btn-${active.title}-${id}`}')
        fixed_lines.append('                  layout')
        fixed_lines.append('                  initial={{ opacity: 0 }}')
        fixed_lines.append('                  animate={{ opacity: 1 }}')
        fixed_lines.append('                  exit={{ opacity: 0 }}')
        fixed_lines.append('                  className="absolute top-2 right-2 flex lg:hidden items-center justify-center rounded-full h-8 w-8 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"')
        fixed_lines.append('                  onClick={() => setActive(null)}')
        fixed_lines.append('                >')
        fixed_lines.append('                  <X size={14} />')
        fixed_lines.append('                </motion.button>')
        continue
    if 189 <= line_num <= 200:
        # Skip the empty lines
        continue
        
    # 3. Fix category badges layout (lines 253 to 261)
    if line_num == 254:
        fixed_lines.append('                        {active.techCategory}')
        continue
    if line_num == 255:
        # Skip duplicate active.techCategory
        continue
    if line_num == 260:
        fixed_lines.append('                    </div>')
        continue
    if line_num == 261:
        # Skip empty line
        continue
        
    # 4. Fix cards grid motion.div opening tag close (line 321)
    if line_num == 309:
        # Skip the duplicate line
        continue
    if line_num == 321:
        fixed_lines.append('              >')
        continue
        
    fixed_lines.append(content)

# Save the finished code to src/components/ProjectsSection.tsx
with open(r"d:\aiagent\testing\src\components\ProjectsSection.tsx", "w", encoding="utf-8") as out:
    out.write("\n".join(fixed_lines))

print("ProjectsSection successfully fixed and written via Python!")
