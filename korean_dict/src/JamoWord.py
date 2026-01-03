import hangul_jamo
from jamo import h2j, j2hcj,j2h

class JamoWord:
    # keep DECOMPOSE_MAP for breaking compound vowels if you need
    DECOMPOSE_MAP = {
        # compound vowels
        "ㅘ": ("ㅗ", "ㅏ"),
        "ㅙ": ("ㅗ", "ㅐ"),
        "ㅚ": ("ㅗ", "ㅣ"),
        "ㅝ": ("ㅜ", "ㅓ"),
        "ㅞ": ("ㅜ", "ㅔ"),
        "ㅟ": ("ㅜ", "ㅣ"),
        "ㅢ": ("ㅡ", "ㅣ"),
        # complex finals
        "ㄳ": ("ㄱ", "ㅅ"),
        "ㄵ": ("ㄴ", "ㅈ"),
        "ㄶ": ("ㄴ", "ㅎ"),
        "ㄺ": ("ㄹ", "ㄱ"),
        "ㄻ": ("ㄹ", "ㅁ"),
        "ㄼ": ("ㄹ", "ㅂ"),
        "ㄽ": ("ㄹ", "ㅅ"),
        "ㄾ": ("ㄹ", "ㅌ"),
        "ㄿ": ("ㄹ", "ㅍ"),
        "ㅀ": ("ㄹ", "ㅎ"),
        "ㅄ": ("ㅂ", "ㅅ"),
    }
    VOWELS = set("ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅛㅜㅠㅡㅣㅘㅙㅚㅝㅞㅟㅢ")
    # {
    # ('ㅗ', 'ㅏ'): 'ㅘ',
    # ('ㅗ', 'ㅐ'): 'ㅙ',
    # ('ㅗ', 'ㅣ'): 'ㅚ',
    # ('ㅜ', 'ㅓ'): 'ㅝ',
    # ('ㅜ', 'ㅔ'): 'ㅞ',
    # ('ㅜ', 'ㅣ'): 'ㅟ',
    # ('ㅡ', 'ㅣ'): 'ㅢ'
    # }
    COMPOSE_MAP = {v: k for k, v in DECOMPOSE_MAP.items()}

    def decompose(self, word: str) -> str:
        jamo_str = j2hcj(h2j(word))
        out = []
        for j in jamo_str:
            if j in self.DECOMPOSE_MAP:
                out.extend(self.DECOMPOSE_MAP[j])
            else:
                out.append(j)
        return "".join(out)

    def compose(self, jamo_stream: str, debug: bool=False) -> str:
        out = []
        i = 0
        length = len(jamo_stream)

        # print("out:".join(out)+",i:"+str(i)+",length:" + str(length))

        while i < length:
            do_append = False
            last_valid_syllable = False
            substr = ""

            j = i

            c1_i = j
            c2_i = j + 1
            c3_i = j + 2
            c4_i = j + 3
            c5_i = j + 4

            c1 = jamo_stream[c1_i]
            c2 = jamo_stream[c2_i]
            c3 = jamo_stream[c3_i] if c3_i < length else None
            c4 = jamo_stream[c4_i] if c4_i < length else None
            c5 = jamo_stream[c5_i] if c5_i < length else None

            if debug: print(jamo_stream[j:])

            is_current_vowel = c2 in self.VOWELS
            is_c2_vowel = None

            if c3_i == length:
                out.append(j2h(c1,c2))
                break

            c3 = jamo_stream[c3_i]
            is_c2_vowel = c3 in self.VOWELS

            # COMPOSE AS 2 VOWELS or 2 FINAL CONSONANTS
            is_compound_vowel = is_c2_vowel and (c2, c3) in self.COMPOSE_MAP

            if is_compound_vowel:
                if debug: print(f"var1: {c2} var2: {c3}")

                new_vowel = self.COMPOSE_MAP[(c2, c3)]

                if debug: print("new_vowel: "+new_vowel)

                jamo_stream = jamo_stream[:c2_i] + new_vowel + jamo_stream[c3_i+1:]
                length -= 1
                continue

            is_c3_vowel = c3 in self.VOWELS if c3 != None else None
            is_c4_vowel = c4 in self.VOWELS if c4 != None else None
            is_c5_vowel = c5 in self.VOWELS if c5 != None else None
            # c5 can be a C or None but cannot be a V otherwise it would require previous C.
            is_compound_final_consonant = (
                is_c3_vowel == False and
                is_c4_vowel == False and
                is_c5_vowel == False and
                (c3, c4) in self.COMPOSE_MAP
            )

            if is_compound_final_consonant:
                if debug: print(f"var1: {c3} var2: {c4}")

                new_consonant = self.COMPOSE_MAP[(c3, c4)]

                if debug: print("new_consonant: "+new_consonant)

                jamo_stream = jamo_stream[:c3_i] + new_consonant + jamo_stream[c4_i+1:]
                length -= 1
                continue

            # At least I know that I can try all cases without compound combinations

            #1 C V          - end of the word!
            #2 C V C        - end of the word!
            #3 C V|C V      - new syllable!
            #4 C V C|C V    - new syllable!

            #1 end of the word!
            if c3 == None:
                if debug: print("#1")
                out.append(j2h(c1,c2))
                break

            #2 end of the word!
            if c4 == None:
                if debug: print("#2")
                out.append(j2h(c1,c2,c3))
                break

            #3 new syllable!
            is_c4_vowel = c4 in self.VOWELS
            if is_c4_vowel:
                if debug: print(f"#3 {c1} {c2}")
                out.append(j2h(c1,c2))
                i += 2
                continue

            #4 new syllable!
            is_c5_vowel = c5 in self.VOWELS
            if is_c5_vowel:
                if debug: print("#5")
                out.append(j2h(c1,c2,c3))
                i += 3
                continue

        return "".join(out)
