import sys

file_path = "d:/aiagent/testing/src/components/HeroSection.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if "{/* Right Column - REDESIGNED Premium Strategy Sandbox Dashboard */}" in line:
        start_idx = i
    if "{/* Floating Key Projects Card Indicator */}" in line:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    new_content = lines[:start_idx + 2] # Keep the column wrapper
    
    replacement = """
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-white/10 group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img 
              src="/profile-photo.jpg" 
              alt="Ganpat Koli" 
              className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
            />
          </motion.div>
"""
    new_content.append(replacement)
    new_content.extend(lines[end_idx:])
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(new_content)
    print("Success")
else:
    print(f"Failed to find indices. Start: {start_idx}, End: {end_idx}")
