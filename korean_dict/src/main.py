#!/usr/bin/env python3

from JamoWord import JamoWord
import re
from wcwidth import wcswidth

def clean(text):
    return re.sub(r"[^가-힣ㄱ-ㅎㅏ-ㅣ]", "", text)

def pprintn(array):
    jamo = JamoWord()

    idx_width = len(str(len(array))) + 1

    # compute REAL display width
    jamo_col_width = max(wcswidth(txt) for txt in array) + 2

    for i, txt in enumerate(array, 1):
        pad = jamo_col_width - wcswidth(txt)
        print(
            f"{i:{idx_width}d}. "
            f"{txt}{' ' * pad}"
            f"{jamo.compose(txt)}"
        )

def build_vocab(file):
    hangul_map = {} # map ensures uniqeness
    try:
        file = open(file)
    except:
        print("File not found")
        return []
    else:
        jamo = JamoWord()
        for sentence in file:
            words = sentence.split(" ")
            for word in words:
                clean_word = clean(word)
                jamo_s = jamo.decompose(clean_word)
                hangul_map[jamo_s] = None
        file.close()
    return list(hangul_map)

dictionary = build_vocab("./data/subtitles/ko.txt")
pprintn(dictionary)
