#!/usr/bin/env python3

from Indexes import Indexes
from JamoWord import JamoWord
from WiktionaryEnglishScraper import WiktionaryEnglishScraper

sortedList_freq = Indexes.read_json("./web/dictionary/indexes/sortedList_freq.json")
sortedList_defaulthangul = Indexes.read_json("./web/dictionary/indexes/sortedList_defaulthangul.json")
sortedList_keylength_alpha = Indexes.read_json("./web/dictionary/indexes/sortedList_keylength_alpha.json")
sortedList_length_customalpha = Indexes.read_json("./web/dictionary/indexes/sortedList_length_customalpha.json")
sortedList_length_freq_customalpha = Indexes.read_json("./web/dictionary/indexes/sortedList_length_freq_customalpha.json")
filtered_sortedList_length_freq_customalpha = Indexes.read_json("./web/dictionary/indexes/filtered_sortedList_length_freq_customalpha.json");

# Starts with ㄴ - OK!
line_x = Indexes.first_index_ge(sortedList_defaulthangul, lambda x: x[0][0], "ㄴ")
print("Starts with ㄴ:" + str(line_x == 2401))

# Frequency >= 40 - OK! - number must be inverted because file is sorted in descending order!
line_x = Indexes.first_index_ge(sortedList_freq, lambda x: -int(x[1]), -40)
print("Frequency >= 40:" + str(line_x == 178))

# Word length > 3 - OK!
line_x = Indexes.first_index_ge(sortedList_keylength_alpha, lambda x: len(x[0]), 3)
print("Word length > 3:" + str(line_x == 69))

# Length >= 6 - ok!
line_x = Indexes.first_index_ge(sortedList_length_freq_customalpha, lambda x: len(x[0]), 6)
print("Length >= 6:" + str(line_x == 2352))

print(JamoWord.decompose("한굴") == "ㅎㅏㄴㄱㅜㄹ")
print(JamoWord.compose("ㅎㅏㄴㄱㅜㄹ") == "한굴")

scraper = WiktionaryEnglishScraper(
    output_path="./web/dictionary/indexes/ko_en.json",
    sleeptime=1,       # average 1s per request
    batch_size=50,     # take a long break every 50 words
    long_break=60      # 1 minute break
)
data = scraper.scrape_words(filtered_sortedList_length_freq_customalpha)
scraper.print_json()
