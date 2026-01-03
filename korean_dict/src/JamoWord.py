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

    def get_c(self, jamo_list, j):
        return jamo_list[j] if j < len(jamo_list) else None

    def dbg(self,debug,msg):
        if debug:
            print(msg)

    def compose(self, jamo_list: str, debug: bool=False) -> str:
        out = []
        i = 0
        jamo_list = list(jamo_list)

        while i < len(jamo_list):
            do_append = False
            last_valid_syllable = False
            substr = ""

            c2_i = i + 2
            c3_i = i + 2
            c4_i = i + 3
            c1, c2, c3, c4, c5 = (self.get_c(jamo_list, j) for j in range(i, i+5))

            self.dbg(debug,jamo_list[i:])

            is_current_vowel = c2 in self.VOWELS
            is_c2_vowel = None

            if c3_i == len(jamo_list):
                out.append(j2h(c1,c2))
                break

            c3 = jamo_list[c3_i]
            is_c2_vowel = c3 in self.VOWELS

            # COMPOSE AS 2 VOWELS or 2 FINAL CONSONANTS
            is_compound_vowel = is_c2_vowel and (c2, c3) in self.COMPOSE_MAP

            if is_compound_vowel:
                self.dbg(debug,f"var1: {c2} var2: {c3}")

                new_vowel = self.COMPOSE_MAP[(c2, c3)]

                self.dbg(debug,"new_vowel: "+new_vowel)

                jamo_list[c2_i] = new_vowel
                jamo_list.pop(c3_i)
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
                self.dbg(debug,f"var1: {c3} var2: {c4}")

                new_consonant = self.COMPOSE_MAP[(c3, c4)]

                self.dbg(debug,"new_consonant: "+new_consonant)

                jamo_list[c3_i] = new_consonant
                jamo_list.pop(c4_i)
                continue

            # At least I know that I can try all cases without compound combinations

            #1 C V          - end of the word!
            #2 C V C        - end of the word!
            #3 C V|C V      - new syllable!
            #4 C V C|C V    - new syllable!

            #1 end of the word!
            if c3 == None:
                self.dbg(debug,"#1")
                out.append(j2h(c1,c2))
                break

            #2 end of the word!
            if c4 == None:
                self.dbg(debug,"#2")
                out.append(j2h(c1,c2,c3))
                break

            #3 new syllable!
            is_c4_vowel = c4 in self.VOWELS
            if is_c4_vowel:
                self.dbg(debug,f"#3 {c1} {c2}")
                out.append(j2h(c1,c2))
                i += 2
                continue

            #4 new syllable!
            is_c5_vowel = c5 in self.VOWELS
            if is_c5_vowel:
                self.dbg(debug,"#5")
                out.append(j2h(c1,c2,c3))
                i += 3
                continue

        return "".join(out)
