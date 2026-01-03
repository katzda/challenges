#!/usr/bin/env python3

import hangul_jamo
from jamo import h2j, j2hcj, j2h
from JamoWord import JamoWord

# print(hangul_jamo.compose("ㅗㅏ"))
# print(j2h("ㅎ","ㅘ"))
jamo = JamoWord()
print(jamo.compose("ㅁㅏㄴㅎㄷㅏ", True))

