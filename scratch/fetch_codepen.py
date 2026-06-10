import urllib.request
import zipfile
import io

url = "https://codepen.io/kristen17/share/zip/bGJBxja"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/zip, */*',
    'Accept-Language': 'en-US,en;q=0.9',
}

req = urllib.request.Request(url, headers=headers)
try:
    print(f"Fetching zip from: {url}")
    with urllib.request.urlopen(req) as response:
        zip_data = response.read()
        print(f"Successfully fetched zip! Size: {len(zip_data)} bytes")
        
        # Unzip the contents
        z = zipfile.ZipFile(io.BytesIO(zip_data))
        print("Extracting files...")
        z.extractall("scratch/extracted_pen")
        print("Done! Files in scratch/extracted_pen:")
        for name in z.namelist():
            print(f" - {name}")
except Exception as e:
    print(f"Error fetching zip: {e}")
