import subprocess
import os
import re
import json
import html as html_parser

# Try Chrome paths
chrome_paths = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
]

chrome_exe = None
for path in chrome_paths:
    if os.path.exists(path):
        chrome_exe = path
        break

if not chrome_exe:
    print("Could not find Chrome or Edge executable!")
    exit(1)

print(f"Using browser: {chrome_exe}")
url = "https://codepen.io/kristen17/pen/bGJBxja"

# Bypassing Cloudflare Turnstile by hiding automation features and setting browser args
cmd = [
    chrome_exe,
    "--headless",
    "--dump-dom",
    "--disable-gpu",
    "--disable-blink-features=AutomationControlled",
    "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "--window-size=1920,1080",
    url
]

try:
    print(f"Running command: {' '.join(cmd)}")
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8', timeout=30)
    dom = result.stdout
    print(f"Successfully dumped DOM! Length: {len(dom)}")
    
    # Write full DOM to inspect
    with open('scratch/codepen_dom.html', 'w', encoding='utf-8') as f:
        f.write(dom)
        
    # Search for init-data
    init_data_match = re.search(r'id="init-data"[^>]*value="([^"]+)"', dom)
    if init_data_match:
        json_str = html_parser.unescape(init_data_match.group(1))
        data = json.loads(json_str)
        print("Found init-data in DOM!")
        pen_data = data.get('item', {})
        print(f"Pen Title: {pen_data.get('title')}")
        print("Writing source files...")
        with open('scratch/codepen_html.html', 'w', encoding='utf-8') as f:
            f.write(pen_data.get('html', ''))
        with open('scratch/codepen_css.css', 'w', encoding='utf-8') as f:
            f.write(pen_data.get('css', ''))
        with open('scratch/codepen_js.js', 'w', encoding='utf-8') as f:
            f.write(pen_data.get('js', ''))
        print("Success!")
    else:
        print("Could not find id='init-data' in the dumped DOM.")
        # Check if the title is still "Just a moment..."
        title_match = re.search(r'<title>(.*?)</title>', dom)
        if title_match:
            print(f"Page Title: {title_match.group(1)}")
            
except Exception as e:
    print(f"Error: {e}")
