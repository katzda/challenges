#!/usr/bin/env python3

from JamoWord import JamoWord
import re
from wcwidth import wcswidth

def clean(text):
    return re.sub(r"[^가-힣ㄱ-ㅎㅏ-ㅣ]", "", text)

def printn(dictionary, skip: int, noskip: int):
    jamo = JamoWord()
    keys = list(dictionary)

    total = len(keys)

    if skip == -1:
        start = max(total - noskip, 0)
    else:
        start = min(skip, total)

    end = min(start + noskip, total)
    slice_keys = keys[start:end]

    if not slice_keys:
        return

    idx_width = len(str(end)) + 1
    jamo_col_width = max(wcswidth(k) for k in slice_keys)

    for i, txt in enumerate(slice_keys, start + 1):
        pad = jamo_col_width - wcswidth(txt)
        print(
            f"{i:{idx_width}d}. "
            f"{txt}{' ' * pad}  "
            f"{jamo.compose(txt)}"
            f"\t {dictionary[txt]}"
        )

def build_vocab(file_path, hangul_map=None):
    if hangul_map is None:
        hangul_map = {}

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

    return hangul_map

dictionary = build_vocab("./data/subtitles/ko.txt")
printn(dictionary, 0, 10)
