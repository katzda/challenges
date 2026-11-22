const indexFiles = {
  by_frequency: {
    path: "indexes/sortedList_freq.json",
    bookmarks: "frequency"
  },
  by_alphabet: {
    path: "indexes/sortedList_defaulthangul.json",
    bookmarks: "jamo"
  },
  by_length_customalpha: {
    path: "indexes/sortedList_length_customalpha.json",
    bookmarks: "length"
  },
  by_length_freq_customalpha: {
    path: "indexes/sortedList_length_freq_customalpha.json",
    bookmarks: "length"
  },
  by_keylength_alpha: {
    path: "indexes/sortedList_keylength_alpha.json",
    bookmarks: "length"
  },
  by_filtered_length_freq_customalpha: {
    path: "indexes/filtered_sortedList_length_freq_customalpha.json",
    bookmarks: "length"
  }
};

const INITIALS = [..."ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"];
const VOWELS = [..."ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ"];
const FINALS = [
  "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ",
  "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ",
  "ㅋ", "ㅌ", "ㅍ", "ㅎ"
];
const VOWEL_SET = new Set(VOWELS);
const CONSONANT_SET = new Set(INITIALS.concat(FINALS));
const COMPOUND_VOWELS = new Map([
  ["ㅗㅏ", "ㅘ"],
  ["ㅗㅐ", "ㅙ"],
  ["ㅗㅣ", "ㅚ"],
  ["ㅜㅓ", "ㅝ"],
  ["ㅜㅔ", "ㅞ"],
  ["ㅜㅣ", "ㅟ"],
  ["ㅡㅣ", "ㅢ"]
]);
const COMPOUND_FINALS = new Map([
  ["ㄱㅅ", "ㄳ"],
  ["ㄴㅈ", "ㄵ"],
  ["ㄴㅎ", "ㄶ"],
  ["ㄹㄱ", "ㄺ"],
  ["ㄹㅁ", "ㄻ"],
  ["ㄹㅂ", "ㄼ"],
  ["ㄹㅅ", "ㄽ"],
  ["ㄹㅌ", "ㄾ"],
  ["ㄹㅍ", "ㄿ"],
  ["ㄹㅎ", "ㅀ"],
  ["ㅂㅅ", "ㅄ"]
]);

let indexes = {};
let koEn = {};
let currentSort = "by_frequency";
let currentIndex = 0;
let sortedItems = [];
let visibleItems = [];

const loadStatus = document.getElementById("loadStatus");
const dictionaryApp = document.getElementById("dictionaryApp");
const searchInput = document.getElementById("searchInput");

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }
  return response.json();
}

function normalizeIndex(data, path) {
  if (!Array.isArray(data)) {
    throw new Error(`${path} must contain a JSON array`);
  }

  return data.map((record, index) => {
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      throw new Error(`${path} has an invalid record at position ${index + 1}`);
    }

    const entries = Object.entries(record);
    if (entries.length !== 1) {
      throw new Error(`${path} has an invalid record at position ${index + 1}`);
    }

    const [jamo, frequency] = entries[0];
    if (typeof frequency !== "number" || !Number.isFinite(frequency)) {
      throw new Error(`${path} has an invalid frequency for ${jamo}`);
    }

    return { jamo, frequency };
  });
}

async function initializeApp() {
  try {
    const loadedIndexes = await Promise.all(
      Object.entries(indexFiles).map(async ([key, config]) => {
        const data = await fetchJson(config.path);
        return [key, normalizeIndex(data, config.path)];
      })
    );
    indexes = Object.fromEntries(loadedIndexes);

    const meaningData = await fetchJson("indexes/ko_en.json");
    if (!meaningData || typeof meaningData !== "object" || Array.isArray(meaningData)) {
      throw new Error("indexes/ko_en.json must contain a word-to-meanings object");
    }
    for (const [jamo, meanings] of Object.entries(meaningData)) {
      if (!Array.isArray(meanings) || !meanings.every(meaning => typeof meaning === "string")) {
        throw new Error(`indexes/ko_en.json has invalid meanings for ${jamo}`);
      }
    }
    koEn = meaningData;

    document.getElementById("sortSelect").addEventListener("change", event => {
      setSort(event.target.value);
    });
    searchInput.addEventListener("input", applySearch);
    document.getElementById("prevBtn").addEventListener("click", () => {
      currentIndex = Math.max(0, currentIndex - 2);
      renderPages();
    });
    document.getElementById("nextBtn").addEventListener("click", () => {
      if (currentIndex + 2 < visibleItems.length) {
        currentIndex += 2;
      }
      renderPages();
    });

    loadStatus.hidden = true;
    dictionaryApp.hidden = false;
    setSort(currentSort);
  } catch (error) {
    loadStatus.textContent = `Unable to load dictionary data: ${error.message}`;
    loadStatus.classList.add("error");
    console.error("Unable to initialize the dictionary:", error);
  }
}

function setSort(sortKey) {
  const config = indexFiles[sortKey];
  if (!config || !indexes[sortKey]) {
    throw new Error(`Dictionary index is not loaded: ${sortKey}`);
  }

  currentSort = sortKey;
  sortedItems = indexes[sortKey];
  currentIndex = 0;
  applySearch();
}

function applySearch() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  visibleItems = query
    ? sortedItems.filter(item => {
        const meanings = koEn[item.jamo] || [];
        const searchableText = [
          item.jamo,
          composeJamo(item.jamo),
          meanings.join(" ")
        ].join(" ").toLocaleLowerCase();
        return searchableText.includes(query);
      })
    : sortedItems;

  currentIndex = 0;
  generateBookmarks();
  renderPages();
}

function generateBookmarks() {
  const bookmarksDiv = document.getElementById("bookmarks");
  bookmarksDiv.replaceChildren();

  const bookmarkType = indexFiles[currentSort].bookmarks;
  let bookmarks;

  if (bookmarkType === "frequency") {
    bookmarks = [...new Set(visibleItems.map(item => item.frequency))]
      .sort((a, b) => b - a)
      .slice(0, 20);
    bookmarks.forEach(frequency => {
      addBookmark(frequency, () => jumpToFrequency(frequency));
    });
  } else if (bookmarkType === "jamo") {
    bookmarks = [...new Set(visibleItems.map(item => item.jamo[0]))];
    bookmarks.forEach(jamo => addBookmark(jamo, () => jumpToJamo(jamo)));
  } else {
    bookmarks = [...new Set(visibleItems.map(item => item.jamo.length))]
      .sort((a, b) => a - b);
    bookmarks.forEach(length => addBookmark(length, () => jumpToLength(length)));
  }
}

function addBookmark(label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  document.getElementById("bookmarks").appendChild(button);
}

function renderPages() {
  const leftItem = visibleItems[currentIndex];
  const rightItem = visibleItems[currentIndex + 1];
  renderEntry(document.getElementById("pageLeft"), leftItem);
  renderEntry(document.getElementById("pageRight"), rightItem);

  const position = document.getElementById("position");
  if (visibleItems.length === 0) {
    position.textContent = "No dictionary entries match this search.";
  } else {
    const first = currentIndex + 1;
    const last = Math.min(currentIndex + 2, visibleItems.length);
    position.textContent = `Showing ${first}–${last} of ${visibleItems.length} entries`;
  }

  document.getElementById("prevBtn").disabled = currentIndex === 0;
  document.getElementById("nextBtn").disabled = currentIndex + 2 >= visibleItems.length;
}

function renderEntry(container, item) {
  container.replaceChildren();
  if (!item) {
    return;
  }

  const heading = document.createElement("h2");
  heading.textContent = composeJamo(item.jamo);

  const jamo = document.createElement("p");
  jamo.className = "jamo";
  jamo.textContent = item.jamo;

  const meanings = koEn[item.jamo] || [];
  const meaningText = document.createElement("p");
  meaningText.className = "meanings";
  meaningText.textContent = meanings.length
    ? `${meanings.slice(0, 8).join(", ")}${meanings.length > 8 ? `, and ${meanings.length - 8} more` : ""}`
    : "No English meanings found.";

  const frequency = document.createElement("p");
  frequency.textContent = `Frequency: ${item.frequency}`;

  container.append(heading, jamo, meaningText, frequency);
}

function composeJamo(word) {
  const chars = [...word];
  const output = [];
  let index = 0;

  while (index < chars.length) {
    const initialIndex = INITIALS.indexOf(chars[index]);
    if (initialIndex < 0 || !VOWEL_SET.has(chars[index + 1])) {
      output.push(chars[index]);
      index += 1;
      continue;
    }

    index += 1;
    let vowel = chars[index];
    index += 1;
    const compoundVowel = COMPOUND_VOWELS.get(vowel + chars[index]);
    if (compoundVowel) {
      vowel = compoundVowel;
      index += 1;
    }

    let final = "";
    const firstFinal = chars[index];
    if (firstFinal && CONSONANT_SET.has(firstFinal) && !VOWEL_SET.has(chars[index + 1])) {
      const secondFinal = chars[index + 1];
      const compoundFinal = COMPOUND_FINALS.get(firstFinal + secondFinal);
      if (compoundFinal && !VOWEL_SET.has(chars[index + 2])) {
        final = compoundFinal;
        index += 2;
      } else {
        final = firstFinal;
        index += 1;
      }
    }

    const vowelIndex = VOWELS.indexOf(vowel);
    const finalIndex = FINALS.indexOf(final);
    if (vowelIndex < 0 || finalIndex < 0) {
      output.push(chars[index - 1]);
      continue;
    }

    output.push(String.fromCharCode(
      0xac00 + (initialIndex * 21 + vowelIndex) * 28 + finalIndex
    ));
  }

  return output.join("");
}

function jumpToFrequency(frequency) {
  jumpTo(item => item.frequency === frequency);
}

function jumpToJamo(jamo) {
  jumpTo(item => item.jamo.startsWith(jamo));
}

function jumpToLength(length) {
  jumpTo(item => item.jamo.length === length);
}

function jumpTo(predicate) {
  const index = visibleItems.findIndex(predicate);
  if (index !== -1) {
    currentIndex = index;
    renderPages();
  }
}

initializeApp();
