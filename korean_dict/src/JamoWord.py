from typing import Iterable, List, Optional
from jamo import h2j, j2hcj, j2h

class JamoWord:
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

    COMPOSE_MAP = {v: k for k, v in DECOMPOSE_MAP.items()}
    VOWELS = set("ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅛㅜㅠㅡㅣㅘㅙㅚㅝㅞㅟㅢ")

    # ---------- utilities ----------

    @staticmethod
    def _safe_get(seq: List[str], idx: int) -> Optional[str]:
        return seq[idx] if idx < len(seq) else None

    @classmethod
    def _is_vowel(cls, jamo: Optional[str]) -> bool:
        return jamo in cls.VOWELS if jamo else False

    # ---------- public API ----------

    def decompose(self, word: str) -> str:
        jamo = j2hcj(h2j(word))
        result: List[str] = []

        for char in jamo:
            result.extend(self.DECOMPOSE_MAP.get(char, (char,)))

        return "".join(result)

    def compose(self, jamo: Iterable[str], debug: bool = False) -> str:
        jamo = list(jamo)
        out: List[str] = []
        i = 0

        def dbg(msg: str) -> None:
            if debug:
                print(msg)

        while i < len(jamo):
            c1 = self._safe_get(jamo, i)
            c2 = self._safe_get(jamo, i + 1)
            c3 = self._safe_get(jamo, i + 2)
            c4 = self._safe_get(jamo, i + 3)
            c5 = self._safe_get(jamo, i + 4)

            dbg(jamo[i:])

            # --- compose compound vowel (중성 결합) ---
            if self._is_vowel(c2) and self._is_vowel(c3):
                pair = (c2, c3)
                if pair in self.COMPOSE_MAP:
                    jamo[i + 1] = self.COMPOSE_MAP[pair]
                    jamo.pop(i + 2)
                    dbg(f"compound vowel: {pair} -> {jamo[i+1]}")
                    continue

            # --- compose compound final consonant (종성 결합) ---
            if (
                not self._is_vowel(c3)
                and not self._is_vowel(c4)
                and not self._is_vowel(c5)
                and (c3, c4) in self.COMPOSE_MAP
            ):
                jamo[i + 2] = self.COMPOSE_MAP[(c3, c4)]
                jamo.pop(i + 3)
                dbg(f"compound final: {(c3, c4)} -> {jamo[i+2]}")
                continue

            # --- syllable resolution ---
            if c3 is None:
                out.append(j2h(c1, c2))
                break

            if c4 is None:
                out.append(j2h(c1, c2, c3))
                break

            if self._is_vowel(c4):
                out.append(j2h(c1, c2))
                i += 2
                continue

            if self._is_vowel(c5):
                out.append(j2h(c1, c2, c3))
                i += 3
                continue

        return "".join(out)
