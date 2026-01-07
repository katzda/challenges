from JamoWord import JamoWord
import re
from wcwidth import wcswidth
from typing import Iterable, Dict, List, Tuple, Union
from collections import defaultdict
import math
import json

class Indexes:

    @staticmethod
    def printn(data, skip=0, noskip=None):
        """
        data: dict[str, int] or list[tuple[str, int]]
        skip: start index (0-based); if -1, take last `noskip` items
        noskip: number of records to print
        """
        # Convert dict -> list of (key, value) tuples if needed
        if isinstance(data, dict):
            items = list(data.items())
        else:
            items = data

        total = len(items)

        # Handle skip
        if skip == -1:
            start = max(total - (noskip or total), 0)
        else:
            start = min(skip, total)

        # Determine end
        if noskip is None:
            end = total
        else:
            end = min(start + noskip, total)

        slice_items = items[start:end]

        if not slice_items:
            return

        # Column widths
        idx_width = len(str(end)) + 1
        jamo_col_width = max(wcswidth(k) for k, _ in slice_items)
        composed_col_width = max(wcswidth(JamoWord.compose(k)) for k, _ in slice_items)

        # Print rows
        for i, (txt, value) in enumerate(slice_items, start + 1):
            jamo_decomp = txt
            jamo_comp = JamoWord.compose(txt)

            # Calculate padding for both columns
            pad_decomp = jamo_col_width - wcswidth(jamo_decomp)
            pad_comp = composed_col_width - wcswidth(jamo_comp)

            print(
                f"{i:{idx_width}d}. "
                f"{jamo_decomp}{' ' * pad_decomp}  "
                f"{jamo_comp}{' ' * pad_comp}  "
                f"{value}"
            )


    @staticmethod
    def clean(text):
        return re.sub(r"[^가-힣ㄱ-ㅎㅏ-ㅣ]", "", text)

    @staticmethod
    def sort_freq(vocab: Dict[str, int], reverse: bool = True) -> List[Tuple[str, int]]:
        """Sort by frequency. reverse=True → descending (most frequent first)."""
        return sorted(vocab.items(), key=lambda kv: kv[1], reverse=reverse)

    @staticmethod
    def sort_defaulthangul(vocab: Dict[str, int], reverse: bool = False) -> List[Tuple[str, int]]:
        """Sort by key (JamoWord string). reverse=False → ascending alphabetical."""
        return sorted(vocab.items(), key=lambda kv: kv[0], reverse=reverse)

    @staticmethod
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

    @staticmethod
    def jamo_sort_key(s: str):
        return tuple(Indexes.JAMO_RANK.get(ch, 10_000) for ch in s)

    @staticmethod
    def sort_length_customalpha(vocab: dict[str, int], reverse: bool = False):
        return sorted(
            vocab.items(),
            key=lambda kv: (len(kv[0]), Indexes.jamo_sort_key(kv[0])),
            reverse=reverse
        )

    @staticmethod
    def first_index_ge(items, key_func, target):
        """
        Binary search for first index where key_func(item) >= target.
        items: sorted by key_func
        """
        lo, hi = 0, len(items)
        while lo < hi:
            mid = (lo + hi) // 2
            if key_func(items[mid]) < target:
                lo = mid + 1
            else:
                hi = mid
        return lo  # index of first item meeting criterion

    @staticmethod
    def sort_length_freq_customalpha(
        vocab: dict[str, int],
        reverse: bool = False,
    ):
        return sorted(
            vocab.items(),
            key=lambda kv: (
                len(kv[0]),          # 1) length
                -kv[1],              # 2) frequency (higher first)
                Indexes.jamo_sort_key(kv[0]) # 3) custom JamoWord order
            ),
            reverse=reverse
        )

    @staticmethod
    def build_vocab(file_path, hangul_map):
        try:
            with open(file_path, "r") as f:
                for sentence in f:
                    for word in sentence.split():
                        clean_word = Indexes.clean(word)
                        if not clean_word:
                            continue

                        jamo_s = JamoWord.decompose(clean_word)
                        hangul_map[jamo_s] = hangul_map.get(jamo_s, 0) + 1

        except FileNotFoundError:
            print(f"File not found: {file_path}")

    @staticmethod
    def write_json(
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

    @staticmethod
    def write_txt(
        file_path: str,
        data: Union[Dict[str, int], Iterable[Tuple[str, int]]],
    ):
        # Normalize input to iterable of (key, value)
        if isinstance(data, dict):
            items = data.items()
        else:
            items = data
        with open(file_path, "w") as file:
            for key, value in items:
                file.write(f'{JamoWord.compose(key)}\n')

    @staticmethod
    def read_tuple_txt(file_path: str) -> List[Tuple[str, int]]:
        """
        Reads a file in the format 'key:frequency' per line
        and returns a list of (key, frequency) tuples.
        """
        tuples: List[Tuple[str, int]] = []

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line or ":" not in line:
                        continue  # skip empty or malformed lines

                    key, value_str = line.split(":", 1)
                    try:
                        value = int(value_str)
                        tuples.append((key, value))
                    except ValueError:
                        # skip lines where frequency is not an integer
                        continue
        except FileNotFoundError:
            print(f"File not found: {file_path}")

        return tuples

    @staticmethod
    def read_single_txt(file_path: str) -> List[Tuple[str, int]]:
        """
        Reads a file in the format 'key' per line and returns a list.
        """
        mylist = []
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                for line in f:
                    mylist.append(line.strip())
        except FileNotFoundError:
            print(f"File not found: {file_path}")
        return mylist

    @staticmethod
    def read_json(path: str) -> List[Tuple[str, int]]:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        if not isinstance(data, list):
            raise ValueError("Top-level JSON must be a list")

        result: List[Tuple[str, int]] = []

        for item in data:
            if not isinstance(item, dict) or len(item) != 1:
                raise ValueError(f"Invalid entry: {item}")

            (key, value), = item.items()

            if not isinstance(key, str) or not isinstance(value, int):
                raise ValueError(f"Invalid key/value types: {item}")

            result.append((key, value))

        return result

    @staticmethod
    def filter_by_percentile_value_per_length(
        data: Union[Dict[str, int], Iterable[Tuple[str, int]]],
        percentile: float,
    ) -> List[Tuple[str, int]]:
        """
        Applies value-based percentile filtering separately for each length bucket.
        Returns a flat list of (key, value).
        """
        # Normalize input
        if isinstance(data, dict):
            items = list(data.items())
        else:
            items = list(data)

        # Group by length
        buckets = defaultdict(list)
        for k, v in items:
            buckets[len(k)].append((k, v))

        result = []

        for length, bucket in buckets.items():
            if not bucket:
                continue

            freqs = sorted(v for _, v in bucket)

            # Clamp percentile
            p = max(0.0, min(100.0, percentile))

            rank = math.ceil(len(freqs) * p / 100) - 1
            rank = max(rank, 0)

            cutoff = freqs[rank]

            # Filter this bucket
            for k, v in bucket:
                if v >= cutoff:
                    result.append((k, v))

        return result
