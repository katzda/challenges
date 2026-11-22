#!/usr/bin/env python3

from WiktionaryEnglishScraper import WiktionaryEnglishScraper
from Indexes import Indexes
from pathlib import Path

rootDir = Path(__file__).resolve().parent.parent
indexPath = f"{rootDir}/web/dictionary/indexes/filtered_sortedList_length_freq_customalpha.json"
dictionaryPath = f"{rootDir}/web/dictionary/indexes/ko_en.json"

filtered_sortedList_length_freq_customalpha = Indexes.read_json(indexPath);

scraper = WiktionaryEnglishScraper(
    output_path=dictionaryPath,
    sleeptime=1,       # average 1s per request
    batch_size=50,     # take a long break every 50 words
    long_break=60      # 1 minute break
)
data = scraper.scrape_words(filtered_sortedList_length_freq_customalpha)
scraper.print_json()
