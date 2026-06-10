import re

file_path = r"C:\Users\thega\.gemini\antigravity-ide\brain\d8956ca2-61f2-4a4d-918c-9aacb9461b48\.system_generated\steps\527\content.md"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

print("File Length:", len(content))

# Let's search for text tags, headings, or classes
headings = re.findall(r'<h[1-6][^>]*>.*?</h[1-6]>', content)
print("\n--- Headings found ---")
for h in headings[:15]:
    print(h)

# Let's search for any class names related to contact options
print("\n--- Links or references to option pages ---")
links = re.findall(r'href="[^"]*contact[^"]*"', content)
for l in list(set(links))[:15]:
    print(l)

# Let's search for text near options
matches = re.findall(r'(?:[Oo]ption\s*\d+|Contact\s+Form\s+Grid|Simple\s+Centered|Shader|Dither)[^<]{0,100}', content)
print("\n--- Option text snippets ---")
for m in list(set(matches))[:15]:
    print(m)
