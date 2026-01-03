#!/usr/bin/env python3

from JamoWord import JamoWord
import re
from wcwidth import wcswidth
from typing import Dict, List, Tuple

def clean(text):
    return re.sub(r"[^가-힣ㄱ-ㅎㅏ-ㅣ]", "", text)

def printn(data, skip=0, noskip=None):
    """
    data: dict[str, int] or list[tuple[str, int]]
    skip: start index (0-based); if -1, take last `noskip` items
    noskip: number of records to print
    """
    jamo = JamoWord()

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
    composed_col_width = max(wcswidth(jamo.compose(k)) for k, _ in slice_items)

    # Print rows
    for i, (txt, value) in enumerate(slice_items, start + 1):
        jamo_decomp = txt
        jamo_comp = jamo.compose(txt)

        # Calculate padding for both columns
        pad_decomp = jamo_col_width - wcswidth(jamo_decomp)
        pad_comp = composed_col_width - wcswidth(jamo_comp)

        print(
            f"{i:{idx_width}d}. "
            f"{jamo_decomp}{' ' * pad_decomp}  "
            f"{jamo_comp}{' ' * pad_comp}  "
            f"{value}"
        )

def sort_by_freq(vocab: Dict[str, int], reverse: bool = True) -> List[Tuple[str, int]]:
    """Sort by frequency. reverse=True → descending (most frequent first)."""
    return sorted(vocab.items(), key=lambda kv: kv[1], reverse=reverse)

def sort_by_key(vocab: Dict[str, int], reverse: bool = False) -> List[Tuple[str, int]]:
    """Sort by key (jamo string). reverse=False → ascending alphabetical."""
    return sorted(vocab.items(), key=lambda kv: kv[0], reverse=reverse)

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

printn(sort_by_freq(dictionary), 0, 20)
# printn(dictionary, 0, 20)
