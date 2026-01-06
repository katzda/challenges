// -------------------------
// Configuration: index files
// -------------------------
const indexFiles = {
    by_frequency: "indexes/sortedList_freq.json",
    by_length_customalpha: "indexes/sortedList_length_customalpha.json",
    by_length_freq_customalpha: "indexes/sortedList_length_freq_customalpha.json",
    by_keylength_alpha: "indexes/sortedList_keylength_alpha.json",
    by_defaulthangul: "indexes/sortedList_defaulthangul.json"
};

// Global variables
let indexes = {};   // Holds all index arrays
let vocab = {};     // Holds dictionary payload
let currentSort = "by_frequency";  // default sort key
let currentIndex = 0;              // pagination
let sortedItems = [];              // current sorted array

// -------------------------
// Load all JSON files
// -------------------------
const indexPromises = Object.entries(indexFiles).map(([key, path]) =>
    fetch(path)
        .then(res => res.json())
        .then(data => { indexes[key] = data; })
        .catch(err => console.error(`Error loading ${path}:`, err))
);

Promise.all([
    ...indexPromises,
    fetch("vocab.json")
        .then(r => r.json())
        .then(data => { vocab = data; })
        .catch(err => console.warn("vocab.json not found yet; load later:", err))
]).then(() => {
    console.log("All indexes loaded");
    initializeApp();
});

// -------------------------
// Initialization
// -------------------------
function initializeApp() {
    const sortSelect = document.getElementById("sortSelect");
    sortSelect.onchange = (e) => setSort(e.target.value);

    document.getElementById("prevBtn").onclick = () => {
        if (currentIndex >= 2) currentIndex -= 2;
        renderPages();
    };
    document.getElementById("nextBtn").onclick = () => {
        if (currentIndex + 2 < sortedItems.length) currentIndex += 2;
        renderPages();
    };

    setSort(currentSort);
}

// -------------------------
// Set current sorting
// -------------------------
function setSort(sortKey) {
    if (!(sortKey in indexes)) {
        console.error("Sort key not found:", sortKey);
        return;
    }
    currentSort = sortKey;
    sortedItems = indexes[sortKey];
    currentIndex = 0;
    generateBookmarks();
    renderPages();
}

// -------------------------
// Generate bookmarks
// -------------------------
function generateBookmarks() {
    const bookmarksDiv = document.getElementById("bookmarks");
    bookmarksDiv.innerHTML = "";

    let bookmarks = [];

    if (currentSort === "by_frequency") {
        // Top 20 frequencies
        const topFreqs = [...new Set(sortedItems.map(x => x.freq))]
            .sort((a, b) => b - a)
            .slice(0, 20);
        bookmarks = topFreqs;
        bookmarks.forEach(f => {
            const btn = document.createElement("button");
            btn.textContent = f;
            btn.onclick = () => jumpToFrequency(f);
            bookmarksDiv.appendChild(btn);
        });
    } else if (currentSort.includes("alphabet") || currentSort === "by_defaulthangul") {
        // First jamo of each section
        bookmarks = [...new Set(sortedItems.map(x => x.jamo[0]))];
        bookmarks.forEach(j => {
            const btn = document.createElement("button");
            btn.textContent = j;
            btn.onclick = () => jumpToJamo(j);
            bookmarksDiv.appendChild(btn);
        });
    } else if (currentSort.includes("length")) {
        bookmarks = [...new Set(sortedItems.map(x => x.jamo.length))];
        bookmarks.forEach(l => {
            const btn = document.createElement("button");
            btn.textContent = l;
            btn.onclick = () => jumpToLength(l);
            bookmarksDiv.appendChild(btn);
        });
    }
}

// -------------------------
// Page rendering
// -------------------------
function renderPages() {
    const left = document.getElementById("pageLeft");
    const right = document.getElementById("pageRight");

    const leftItem = sortedItems[currentIndex];
    const rightItem = sortedItems[currentIndex + 1];

    left.textContent = leftItem ? formatWord(leftItem) : "";
    right.textContent = rightItem ? formatWord(rightItem) : "";
}

// -------------------------
// Format a word for display
// -------------------------
function formatWord(item) {
    const entry = vocab[item.jamo];
    if (!entry) return item.jamo;
    return `${entry.composed}\n${entry.english || ""}\nFreq: ${entry.freq}`;
}

// -------------------------
// Bookmark navigation helpers
// -------------------------
function jumpToFrequency(freq) {
    const idx = sortedItems.findIndex(x => x.freq === freq);
    if (idx !== -1) currentIndex = idx;
    renderPages();
}
function jumpToJamo(j) {
    const idx = sortedItems.findIndex(x => x.jamo.startsWith(j));
    if (idx !== -1) currentIndex = idx;
    renderPages();
}
function jumpToLength(l) {
    const idx = sortedItems.findIndex(x => x.jamo.length === l);
    if (idx !== -1) currentIndex = idx;
    renderPages();
}
