class Hangulish:

    en_to_ko = {
        "ng": "ㅇ",
        "g": "ㄱ",
        "gg": "ㄲ",
        "gh": "ㅋ",
        "j": "ㅈ",
        "jj": "ㅉ",
        "jh": "ㅊ",
        "p": "ㅂ",
        "pp": "ㅃ",
        "ph": "ㅍ",
        "t": "ㄷ",
        "tt": "ㄸ",
        "th": "ㅌ",
        "s": "ㅅ",
        "ss": "ㅆ",
        "h": "ㅎ",
        "m": "ㅁ",
        "n": "ㄴ",
        "r": "ㄹ",
        "a": "ㅏ",
        "ya": "ㅑ",
        "o": "ㅓ",
        "yo": "ㅕ",
        "q": "ㅗ",
        "yq": "ㅛ",
        "u": "ㅜ",
        "yu": "ㅠ",
        "-": "ㅡ",
        "i": "ㅣ",
        "e": "ㅔ",
        "ye": "ㅖ",
        "ea": "ㅐ",
        "yea": "ㅒ",
    }
    ko_to_en = {v: k for k, v in self.en_to_ko.items()}

    @staticmethod
    def en_to_hangul(word: str) -> str:
        result = []
        for ch in word:
            if ch not in en_to_ko:
                raise ValueError(f"Unknown literal: '{ch}'")
            result.append(en_to_ko[key])
        return "".join(result)

    @staticmethod
    def hangul_to_en(text: str) -> str:
        result = []
        for ch in text:
            if ch not in self.ko_to_en:
                raise ValueError(f"Unknown literal: '{ch}'")
            result.append(ko_to_en[ch])
        return "".join(result)
