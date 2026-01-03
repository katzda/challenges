#!/usr/bin/env python3

from JamoWord import JamoWord
import re

def clean(text):
    return re.sub(r"[^가-힣ㄱ-ㅎㅏ-ㅣ]", "", text)

def printn(array, no_lines):
    cnt = 0
    jamo = JamoWord()
    for txt in array:
        print(txt);
        if cnt == no_lines: break;
        else: cnt += 1

def pprintn(array, no_lines):
    cnt = 0
    jamo = JamoWord()
    for txt in array:
        txt = jamo.compose(txt)
        print(txt);
        if cnt == no_lines: break;
        else: cnt += 1

def build_vocab(file):
    line = 1
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
                # print(clean_word)
                jamo_s = jamo.decompose(clean_word)
                hangul_map[jamo_s] = None
            if line == 10:
                break
            else:
                line+=1
        file.close()
    return list(hangul_map)

dictionary = build_vocab("./data/subtitles/ko.txt")
printn(dictionary, 100)
print("\n")
pprintn(dictionary, 100)
