import requests
from bs4 import BeautifulSoup
from typing import List, Tuple, Dict
import json
import time
import random
import os
import re
from JamoWord import JamoWord

class WiktionaryEnglishScraper:
    BASE_URL = "https://en.wiktionary.org/wiki/"

    def __init__(self, output_path: str, sleeptime: float = 1.0,
                 batch_size: int = 50, long_break: int = 60):
        self.output_path = output_path
        self.sleeptime = sleeptime
        self.batch_size = batch_size
        self.long_break = long_break
        self.data: Dict[str, List[str]] = {}
        if os.path.exists(output_path):
            self.data = self.load_file(output_path)

    # ----------------- File handling -----------------
    def load_file(self, path: str) -> Dict[str, List[str]]:
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}

    def save_file(self):
        with open(self.output_path, "w", encoding="utf-8") as f:
            json.dump(self.data, f, ensure_ascii=False, indent=2)

    # ----------------- Page fetch & parse -----------------
    def _fetch_page(self, hangul_word: str) -> BeautifulSoup:
        url = self.BASE_URL + hangul_word
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (X11; Linux x86_64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0 Safari/537.36"
            )
        }
        try:
            r = requests.get(url, headers=headers, timeout=10)
            if r.status_code == 404:
                # page not found, return None to signal no meanings
                return None
            r.raise_for_status()
            return BeautifulSoup(r.text, "html.parser")
        except requests.HTTPError as e:
            # stop only on forbidden or other serious errors
            if e.response is not None and e.response.status_code == 403:
                raise
            # for other errors (like 500), return None to continue
            return None

    def _parse_meanings(self, hangul_word: str) -> List[str]:
        soup = self._fetch_page(hangul_word)
        if soup is None:
            # page missing, return empty list
            return []
        links = soup.select(".mw-body-content ol a")
        meanings = []
        for a in links:
            text = a.get_text(strip=True)
            filtered = re.sub(r'[^a-zA-Z]', '', text)
            if filtered:
                meanings.append(filtered)
        # remove duplicates while preserving order
        seen = set()
        unique_meanings = []
        for m in meanings:
            if m not in seen:
                seen.add(m)
                unique_meanings.append(m)
        return unique_meanings
    from typing import Callable

    def retry_zero_meanings(self, words: List[Tuple[str, int]] = None,
                            alternative_scraper: Callable[[str], List[str]] = None):
        """
        Retry words with empty meanings using an alternative scraper function.
        - words: optional list to limit retries (decomposed_word, freq)
        - alternative_scraper: function accepting composed Hangul, returning list of English meanings
        """
        if alternative_scraper is None:
            raise ValueError("You must provide an alternative_scraper function")

        iterable = words if words is not None else [(w, 0) for w in self.data.keys()]
        total = len(iterable)
        retried_count = 0

        for i, (decomposed_word, _freq) in enumerate(iterable, start=1):
            # skip words that already have meanings
            if decomposed_word in self.data and self.data[decomposed_word]:
                continue

            try:
                hangul_word = JamoWord.compose(decomposed_word)
                new_meanings = alternative_scraper(hangul_word)
                if new_meanings:
                    # enforce a-zA-Z letters only and remove duplicates
                    filtered = []
                    seen = set()
                    for m in new_meanings:
                        cleaned = re.sub(r'[^a-zA-Z]', '', m)
                        if cleaned and cleaned not in seen:
                            seen.add(cleaned)
                            filtered.append(cleaned)

                    self.data[decomposed_word] = filtered
                    retried_count += 1
                    print(f"[{i}/{total}] Retried '{decomposed_word}' ({hangul_word}): {len(filtered)} meanings found")

                self.save_file()

            except Exception as e:
                print(f"[{i}/{total}] Retry failed for '{decomposed_word}' ({hangul_word}): {e}")

        print(f"\nRetry summary: {retried_count} words updated with alternative scraper")

    # ----------------- Main scrape function -----------------
    def scrape_words(self, words: List[Tuple[str, int]], limit: int | None = None) -> Dict[str, List[str]]:
        iterable = words if limit is None else words[:limit]
        total = len(iterable)
        added_count = 0

        for i, (decomposed_word, _freq) in enumerate(iterable, start=1):
            # skip if already scraped
            if decomposed_word in self.data:
                continue

            try:
                hangul_word = JamoWord.compose(decomposed_word)
                meanings = self._parse_meanings(hangul_word)
                self.data[decomposed_word] = meanings  # keyed by decomposed
                added_count += 1
                print(f"[{i}/{total}] Added '{decomposed_word}' ({hangul_word}) with {len(meanings)} meanings")
                self.save_file()

                # polite sleep
                time.sleep(random.uniform(self.sleeptime * 0.8, self.sleeptime * 1.2))

                # long break every batch_size words
                if added_count % self.batch_size == 0 and i < total:
                    print(f"Batch complete ({added_count} words). Taking a {self.long_break}s break...")
                    time.sleep(self.long_break)

            except requests.HTTPError as e:
                print(f"Stopping scraper due to HTTP error for '{decomposed_word}' ({hangul_word}): {e}")
                break
            except Exception as e:
                print(f"Stopping scraper due to unexpected error for '{decomposed_word}' ({hangul_word}): {e}")
                break

        # Summary
        print("\nScraping summary:")
        print(f"Total words processed: {total}")
        print(f"Total new words added: {added_count}")

        return self.data

    # ----------------- Utility -----------------
    def print_json(self):
        print(json.dumps(self.data, ensure_ascii=False, indent=2))
