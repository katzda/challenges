#!/usr/bin/env python3

from jamo import h2j,j2hcj
import re

# initial consonants (초성)
CHO = list("ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ")
# vowels (중성)
JUNG = list("ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ")

COMPOUND_MAP = {
    "ㅘ": "ㅗㅏ",
    "ㅙ": "ㅗㅐ",
    "ㅚ": "ㅗㅣ",
    "ㅝ": "ㅜㅓ",
    "ㅞ": "ㅜㅔ",
    "ㅟ": "ㅜㅣ",
    "ㅢ": "ㅡㅣ",
}

def decompose_letters(syllable):
    letters = list(j2hcj(h2j(syllable)))
    result = []
    for l in letters:
        if l in COMPOUND_MAP:
            result.extend(list(COMPOUND_MAP[l]))
        else:
            result.append(l)
    return result

def clean_korean(text):
    return re.sub(r"[^가-힣ㄱ-ㅎㅏ-ㅣ]", "", text)

line = 1

hangul = []

try:
    file = open("./data/subtitles/ko.txt")
except:
    print("File not found")
else:
    for sentence in file:
        words = sentence.split(" ")

        for word in words:
            clean_word = clean_korean(word)

            for raw_syllable in clean_word:
                # h2j still doesnt decompose compounds like ㅟ
                compound_letters = h2j(raw_syllable)

                for compound_letter in compound_letters:
                    print(decompose_letters(compound_letter))

        if line == 1:
            break
        else:
            line+=1

    file.close()
