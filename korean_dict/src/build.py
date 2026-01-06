#!/usr/bin/env python3

from JamoWord import JamoWord
import re
from wcwidth import wcswidth
from typing import Iterable, Dict, List, Tuple, Union

def clean(text):
    return re.sub(r"[^가-힣ㄱ-ㅎㅏ-ㅣ]", "", text)

def sort_freq(vocab: Dict[str, int], reverse: bool = True) -> List[Tuple[str, int]]:
    """Sort by frequency. reverse=True → descending (most frequent first)."""
    return sorted(vocab.items(), key=lambda kv: kv[1], reverse=reverse)

def sort_defaulthangul(vocab: Dict[str, int], reverse: bool = False) -> List[Tuple[str, int]]:
    """Sort by key (jamo string). reverse=False → ascending alphabetical."""
    return sorted(vocab.items(), key=lambda kv: kv[0], reverse=reverse)

def sort_length_alpha(vocab: dict[str, int], reverse: bool = False):
    return sorted(
        vocab.items(),
        key=lambda kv: (len(kv[0]), kv[0]),
        reverse=reverse
    )

CONSONANTS = [
    "ㅇ", "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ" "ㄹ", "ㅁ", "ㅂ", "ㅃ"
    "ㅅ", "ㅆ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
]
VOWELS = [
    "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ",
    "ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ", "ㅣ",
]
CUSTOM_JAMO_ORDER = CONSONANTS + VOWELS
JAMO_RANK = {j: i for i, j in enumerate(CUSTOM_JAMO_ORDER)}

def jamo_sort_key(s: str):
    return tuple(JAMO_RANK.get(ch, 10_000) for ch in s)
def sort_length_customalpha(vocab: dict[str, int], reverse: bool = False):
    return sorted(
        vocab.items(),
        key=lambda kv: (len(kv[0]), jamo_sort_key(kv[0])),
        reverse=reverse
    )

def sort_length_freq_customalpha(
    vocab: dict[str, int],
    reverse: bool = False,
):
    return sorted(
        vocab.items(),
        key=lambda kv: (
            len(kv[0]),          # 1) length
            -kv[1],              # 2) frequency (higher first)
            jamo_sort_key(kv[0]) # 3) custom jamo order
        ),
        reverse=reverse
    )

raw = {}
def build_vocab(file_path, hangul_map):
    jamo = JamoWord()

    try:
        with open(file_path, "r") as f:
            for sentence in f:
                for word in sentence.split():
                    clean_word = clean(word)
                    if not clean_word:
                        continue

                    jamo_s = jamo.decompose(clean_word)
                    hangul_map[jamo_s] = hangul_map.get(jamo_s, 0) + 1

    except FileNotFoundError:
        print(f"File not found: {file_path}")


def write_data(
    file_path: str,
    data: Union[Dict[str, int], Iterable[Tuple[str, int]]],
):
    # Normalize input to iterable of (key, value)
    if isinstance(data, dict):
        items = data.items()
    else:
        items = data

    with open(file_path, "w") as file:
        file.write("[")
        separate = False
        for key, value in items:
            if separate:
                file.write(",")
            else:
                separate = True
            file.write("{"+f'"{key}":{value}'+"}")
        file.write("]")

build_vocab("./data/subtitles/ko.txt", raw)
build_vocab("./data/subtitles/starwars.txt", raw)
build_vocab("./data/subtitles/chief.txt", raw)

write_data('./web/dictionary/indexes/raw.json', raw)

sortedList_freq = sort_freq(raw)
write_data('./web/dictionary/indexes/sortedList_freq.json', sortedList_freq)

sortedList_defaulthangul = sort_defaulthangul(raw)
write_data('./web/dictionary/indexes/sortedList_defaulthangul.json', sortedList_defaulthangul)

sortedList_keylength_alpha = sort_length_alpha(raw)
write_data('./web/dictionary/indexes/sortedList_keylength_alpha.json', sortedList_keylength_alpha)

sortedList_length_customalpha = sort_length_customalpha(raw)
write_data('./web/dictionary/indexes/sortedList_length_customalpha.json', sortedList_length_customalpha)

sortedList_length_freq_customalpha = sort_length_freq_customalpha(raw)
write_data('./web/dictionary/indexes/sortedList_length_freq_customalpha.json', sortedList_length_freq_customalpha)
