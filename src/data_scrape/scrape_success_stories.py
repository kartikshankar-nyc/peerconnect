import argparse
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

HEADERS = {"User-Agent": "Mozilla/5.0"}

def classify_tone(text):
    try:
        res = requests.post("http://localhost:11434/api/generate", json={
            "model": "llama3.2", 
            "prompt": f"What is the emotional tone of this text? Respond with one word:\n\n{text[:500]}",
            "stream": False
        })
        data = res.json()
        response = data.get("response", "").strip()
        print(f"[TONE] {response} for article: {text[:60]}...")
        return response

    except Exception as e:
        print("[ERROR] Tone classification failed:", e)
        return None

def is_valid_medium_article(url):
    if not isinstance(url, str):
        return False

    parsed = urlparse(url)
    path_parts = parsed.path.strip("/").split("/")
    # Medium article URLs usually have at least two path parts: username and article slug
    return len(path_parts) >= 2


def scrape_tiny_buddha(max_articles, max_pages):
    base_url = "https://tinybuddha.com/blog-posts/page/"
    articles = []
    count = 0

    for page_num in range(1, max_pages + 1):
        url = base_url + str(page_num)
        print(f"\n[FETCHING] Page: {url}")
        response = requests.get(url, headers=HEADERS)
        soup = BeautifulSoup(response.text, "html.parser")

        links = soup.select(".post-title a")
        print(f"[INFO] Found {len(links)} article links on page {page_num}")

        for link in links:
            article_url = link.get("href")
            try:
                article_res = requests.get(article_url, headers=HEADERS)
                article_soup = BeautifulSoup(article_res.text, "html.parser")

                article_text = article_soup.select_one(".post-content")
                text = article_text.get_text(separator="\n").strip() if article_text else ""

                if len(text) < 200:
                    print(f"[SKIP] Article too short: {article_url}")
                    continue

                tone = classify_tone(text)
                if tone:
                    story = {
                        "tone": tone,
                        "story": text[:600].replace("\n", " ").strip()
                    }
                    articles.append(story)
                    count += 1
                    print(f"[ADDED] {tone}: {text[:50]}...")

                if count >= max_articles:
                    print("[DONE] Reached max_articles limit.")
                    return articles

            except Exception as e:
                print(f"[ERROR] Failed to process article: {article_url} | {e}")

    return articles


def scrape_medium(max_articles, max_pages):
    base_url = "https://medium.com/tag/self-improvement/archive/"
    articles = []
    count = 0

    # Use a few fixed archive pages
    archive_dates = ["2024/05/01", "2024/04/15", "2024/03/30"]
    for archive in archive_dates[:max_pages]:
        url = base_url + archive
        print(f"\n[FETCHING] Medium archive: {url}")
        response = requests.get(url, headers=HEADERS)
        soup = BeautifulSoup(response.text, "html.parser")

        links = soup.select("a[href*='/@']")  # crude Medium article link filter
        print(f"[INFO] Found {len(links)} potential Medium links.")

        for link in links:
            href = link.get("href")
            if not href.startswith("http"):
                href = urljoin("https://medium.com", href)

            try:
                article_res = requests.get(href, headers=HEADERS)
                article_soup = BeautifulSoup(article_res.text, "html.parser")
                paras = article_soup.select("article p")

                text = " ".join(p.get_text() for p in paras if len(p.get_text()) > 30).strip()
                
                if not is_valid_medium_article(href):
                    print(f"[SKIP] Not a valid article URL: {href}")
                    continue

                tone = classify_tone(text)
                if tone:
                    story = {
                        "tone": tone,
                        "story": text[:600].replace("\n", " ").strip()
                    }
                    articles.append(story)
                    count += 1
                    print(f"[ADDED] {tone}: {text[:50]}...")

                if count >= max_articles:
                    print("[DONE] Reached max_articles limit.")
                    return articles

            except Exception as e:
                print(f"[ERROR] Failed to scrape Medium article: {href} | {e}")

    return articles


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", choices=["medium", "buddha"], required=True)
    parser.add_argument("--max", type=int, default=10, help="Max number of articles to scrape")
    parser.add_argument("--pages", type=int, default=2, help="Max number of pages to fetch")
    parser.add_argument("--out", default="success_stories.json", help="Output file")

    args = parser.parse_args()

    if args.source == "buddha":
        stories = scrape_tiny_buddha(args.max, args.pages)
    else:
        stories = scrape_medium(args.max, args.pages)

    print(f"\n[INFO] Writing {len(stories)} stories to {args.out}")
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(stories, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
