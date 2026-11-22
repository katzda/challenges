#!/usr/bin/env python3

from Indexes import Indexes

raw = {}

Indexes.build_vocab("./data/subtitles/ko.txt", raw)
Indexes.build_vocab("./data/subtitles/starwars.txt", raw)
Indexes.build_vocab("./data/subtitles/chief.txt", raw)

sortedList_freq = Indexes.sort_freq(raw)
Indexes.write_json('./web/dictionary/indexes/sortedList_freq.json', sortedList_freq)

sortedList_defaulthangul = Indexes.sort_defaulthangul(raw)
Indexes.write_json('./web/dictionary/indexes/sortedList_defaulthangul.json', sortedList_defaulthangul)

sortedList_keylength_alpha = Indexes.sort_length_alpha(raw)
Indexes.write_json('./web/dictionary/indexes/sortedList_keylength_alpha.json', sortedList_keylength_alpha)

sortedList_length_customalpha = Indexes.sort_length_customalpha(raw)
Indexes.write_json('./web/dictionary/indexes/sortedList_length_customalpha.json', sortedList_length_customalpha)

sortedList_length_freq_customalpha = Indexes.sort_length_freq_customalpha(raw)
filtered_sortedList_length_freq_customalpha = Indexes.filter_by_percentile_value_per_length(sortedList_length_freq_customalpha, 95)
Indexes.write_json('./web/dictionary/indexes/sortedList_length_freq_customalpha.json', sortedList_length_freq_customalpha)
Indexes.write_json('./web/dictionary/indexes/filtered_sortedList_length_freq_customalpha.json', filtered_sortedList_length_freq_customalpha)
