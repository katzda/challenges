#!/usr/bin/env python3

from JamoWord import JamoWord
import re
from wcwidth import wcswidth
from typing import Iterable, Dict, List, Tuple, Union

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

def filter_by_percentile_value(
    items: Iterable[Tuple[str, int]],
    percentile: float,
) -> List[Tuple[str, int]]:
    """
    percentile: 0–100 (supports decimals like 98.5)

    Keeps items whose frequency is >= the percentile value.
    """
    items = list(items)
    if not items:
        return []

    freqs = sorted(v for _, v in items)

    # Clamp percentile
    percentile = max(0.0, min(100.0, percentile))

    # Nearest-rank method (common, intuitive)
    rank = math.ceil(len(freqs) * percentile / 100) - 1
    rank = max(rank, 0)

    cutoff = freqs[rank]

    return [(k, v) for k, v in items if v >= cutoff]

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


def read_tuple_file(file_path: str) -> List[Tuple[str, int]]:
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

sortedList_freq = read_tuple_file("./data/indexes/sortedList_freq.txt")
sortedList_defaulthangul = read_tuple_file("./data/indexes/sortedList_defaulthangul.txt")
sortedList_keylength_alpha = read_tuple_file("./data/indexes/sortedList_keylength_alpha.txt")
sortedList_length_customalpha = read_tuple_file("./data/indexes/sortedList_length_customalpha.txt")
sortedList_length_freq_customalpha = read_tuple_file("./data/indexes/sortedList_length_freq_customalpha.txt")

# print(sortedList_freq[108][1])

# Frequency >= 40 - OK! - number must be inverted because file is sorted in descending order!
# line_x = first_index_ge(sortedList_freq, lambda x: -int(x[1]), -40)

# Starts with ㄴ - OK!
# line_x = first_index_ge(sortedList_defaulthangul, lambda x: x[0][0], "ㄴ")

# Word length > 3 - OK!
# line_x = first_index_ge(sortedList_keylength_alpha, lambda x: len(x[0]), 3)

# Length >= 6 - ok!
# line_x = first_index_ge(sortedList_length_freq_customalpha, lambda x: len(x[0]), 6)

# print(line_x)