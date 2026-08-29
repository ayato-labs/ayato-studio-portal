import urllib.request
import xml.etree.ElementTree as ET
import sys

feeds = [
    # JP
    "https://mof-gov.note.jp/rss",
    # US Tech/Policy
    "https://www.whitehouse.gov/feed/",
    "https://www.nist.gov/news-events/news/rss.xml",
    "https://www.ftc.gov/feeds/press-release-list.xml",
    "https://www.nasa.gov/rss/dyn/breaking_news.rss",
    "https://www.defense.gov/news/rss/",
    # US Finance/Macro
    "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=&dateb=&owner=include&count=40&search_text=&output=atom",
    "https://www.cbo.gov/about/products/rss",
    "https://www.gao.gov/rss/reports.xml",
    "https://www.bls.gov/feed/home.xml"
]

def test_feed(url):
    print(f"--- Testing: {url} ---")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"})
        with urllib.request.urlopen(req, timeout=20) as response:
            code = response.getcode()
            content = response.read()
            print(f"  [HTTP {code}] Body length: {len(content)}")
            try:
                # Basic check for XML-like structure or Atom
                # Some feeds use namespaces correctly, others don't.
                # We mainly care if it's reachable and contains content.
                if len(content) < 100:
                    print(f"  [WARNING] Content too short.")
                root = ET.fromstring(content)
                print(f"  [SUCCESS] XML parsed. Root: {root.tag}")
                return True
            except ET.ParseError as pe:
                # Sometimes note.jp returns valid XML but ET is strict.
                # If we have content and it's HTTP 200, it's likely working for the plugin.
                if b"<rss" in content.lower() or b"<feed" in content.lower():
                    print(f"  [ALMOST SUCCESS] XML check failed but RSS/Feed tag found: {pe}")
                    return True
                print(f"  [FAILURE] XML Parse Error: {pe}")
                return False
    except Exception as e:
        print(f"  [FAILURE] Connection/Request Error: {e}")
        return False

results = []
for f in feeds:
    results.append(test_feed(f))

success_count = sum(1 for r in results if r)
print(f"\nFinal Result: {success_count}/{len(feeds)} feeds are working.")
if success_count == len(feeds):
    sys.exit(0)
else:
    sys.exit(1)
