class HangulGrid {
  constructor() {
    this.choseong = [
      "ㅇ","ㅎ","ㄴ","ㄹ","ㅁ","ㅅ","ㅆ","ㄱ","ㅋ","ㄲ",
      "ㄷ","ㅌ","ㄸ","ㅂ","ㅍ","ㅃ","ㅈ","ㅊ","ㅉ",
    ];
    this.vowels = [
      { char: "아", file: 1 }, { char: "야", file: 2 }, { char: "어", file: 3 },
      { char: "여", file: 4 }, { char: "오", file: 5 }, { char: "요", file: 6 },
      { char: "우", file: 7 }, { char: "유", file: 8 }, { char: "으", file: 9 },
      { char: "이", file: 10 }, { char: "애", file: 11 }, { char: "에", file: 13 },
      { char: "얘", file: 12 }, { char: "예", file: 14 }, { char: "와", file: 15 },
      { char: "왜", file: 16 }, { char: "외", file: 17 }, { char: "웨", file: 19 },
      { char: "워", file: 18 }, { char: "위", file: 20 }, { char: "의", file: 21 }
    ];

    this.folderMap = {
      "ㄱ": "g", "ㄲ": "gg", "ㅋ": "kh", "ㄴ": "n", "ㄷ": "t", "ㄸ": "tt",
      "ㄹ": "r", "ㅁ": "m", "ㅂ": "p", "ㅃ": "pp", "ㅅ": "s", "ㅆ": "ss",
      "ㅇ": "ng", "ㅈ": "j", "ㅉ": "jj", "ㅊ": "jh", "ㅌ": "th", "ㅍ": "ph", "ㅎ": "h"
    };

    this.unicodeChoseongIndex = {
      "ㄱ": 0, "ㄲ": 1, "ㄴ": 2, "ㄷ": 3, "ㄸ": 4, "ㄹ": 5, "ㅁ": 6, "ㅂ": 7,
      "ㅃ": 8, "ㅅ": 9, "ㅆ": 10, "ㅇ": 11, "ㅈ": 12, "ㅉ": 13, "ㅊ": 14,
      "ㅋ": 15, "ㅌ": 16, "ㅍ": 17, "ㅎ": 18
    };

    this.unicodeJungseongIndex = {
      "아":0,"애":1,"야":2,"얘":3,"어":4,"에":5,"여":6,"예":7,
      "오":8,"와":9,"왜":10,"외":11,"요":12,"우":13,"워":14,"웨":15,
      "위":16,"유":17,"으":18,"의":19,"이":20
    };

    this.grid = document.getElementById("grid");
    this.audio = new Audio();
    this.STORAGE_KEY = "highlightedCells";
    this.floatingNote = document.getElementById("floatingNote");
    this.currentCellId = null;

    this.defaultGreenNotes = { 1: "", 2: "", 3: "" };
    this.greenNotes = { ...this.defaultGreenNotes };

    this.highlights = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {};

    // these are your default notes – preserved exactly
    this.defaultHighlights = {
      "ㄹ-3": {
        "red": true,
        "note": "\"L\" sound is inconsistent with fast speech. A \"phonetic\" alphabet must have consistent sounds. Is it just as normal to pronounce this as RO, e.g 더러. Even if it didn't exist, different character should be used for a differently sounding letter."
      },
      "ㄹ-5": {
        "red": true,
        "note": "\"L\" sound is inconsistent with fast speech. A \"phonetic\" alphabet must have consistent sounds. Is it just as normal to pronounce this as \"Rㅗ\""
      },
      "ㄹ-1": {
        "red": true,
        "note": "\"L\" sound is inconsistent with fast speech. A \"phonetic\" alphabet must have consistent sounds. Is it just as normal to pronounce this as RA, which even in Korean happens often, e.g 가라고. Even if it didn't happen, different character should be used for a differently sounding letter."
      },
      "ㄹ-11": {
        "red": true,
        "green": 1
      },
      "ㄹ-13": {
        "red": true,
        "green": 1
      },
      "ㄹ-14": {
        "red": true,
        "note": "English \"R\" sound instead of standard spanish \"R\"."
      },
      "ㄹ-15": {
        "red": true,
        "note": "English \"R\" sound instead of standard spanish \"R\"."
      },
      "ㄹ-16": {
        "red": true,
        "green": 2,
        "note": "English \"R\" sound instead of standard spanish \"R\"."
      },
      "ㄹ-17": {
        "red": true,
        "green": 2,
        "note": "English \"R\" sound instead of standard spanish \"R\"."
      },
      "ㄹ-18": {
        "red": true,
        "note": "English \"R\" sound instead of standard spanish \"R\"."
      },
      "ㄱ-11": {
        "green": 1
      },
      "ㄱ-13": {
        "green": 1
      },
      "ㅇ-11": {
        "green": 1,
        "red": false
      },
      "ㄲ-11": {
        "green": 1
      },
      "ㄲ-13": {
        "green": 1
      },
      "ㄴ-11": {
        "green": 1
      },
      "ㄴ-13": {
        "green": 1
      },
      "ㄷ-11": {
        "green": 1
      },
      "ㄷ-13": {
        "green": 1
      },
      "ㄸ-11": {
        "green": 1
      },
      "ㄸ-13": {
        "green": 1
      },
      "ㅁ-11": {
        "green": 1
      },
      "ㅁ-13": {
        "green": 1
      },
      "ㅂ-11": {
        "green": 1
      },
      "ㅂ-13": {
        "green": 1
      },
      "ㅃ-11": {
        "green": 1
      },
      "ㅃ-13": {
        "green": 1
      },
      "ㅅ-11": {
        "green": 1
      },
      "ㅅ-13": {
        "green": 1
      },
      "ㅆ-11": {
        "green": 1
      },
      "ㅆ-13": {
        "green": 1
      },
      "ㅈ-11": {
        "green": 1
      },
      "ㅈ-13": {
        "green": 1
      },
      "ㅉ-13": {
        "green": 1
      },
      "ㅊ-11": {
        "green": 1
      },
      "ㅋ-11": {
        "green": 1
      },
      "ㅋ-13": {
        "green": 1
      },
      "ㅌ-11": {
        "green": 1
      },
      "ㅌ-13": {
        "green": 1
      },
      "ㅍ-11": {
        "green": 1
      },
      "ㅍ-13": {
        "green": 1
      },
      "ㅎ-11": {
        "green": 1
      },
      "ㅎ-13": {
        "green": 1,
        "red": false
      },
      "ㄱ-16": {
        "green": 2
      },
      "ㄱ-17": {
        "green": 2
      },
      "ㄲ-16": {
        "green": 2
      },
      "ㄲ-17": {
        "green": 2
      },
      "ㄴ-16": {
        "green": 2
      },
      "ㄴ-17": {
        "green": 2
      },
      "ㄷ-16": {
        "green": 2
      },
      "ㄷ-17": {
        "green": 2
      },
      "ㄸ-16": {
        "green": 2
      },
      "ㄸ-17": {
        "green": 2
      },
      "ㅁ-16": {
        "green": 2
      },
      "ㅁ-17": {
        "green": 2
      },
      "ㅂ-17": {
        "green": 2
      },
      "ㅂ-16": {
        "green": 2
      },
      "ㅃ-16": {
        "green": 2
      },
      "ㅃ-17": {
        "green": 2
      },
      "ㅅ-17": {
        "green": 2
      },
      "ㅅ-16": {
        "green": 2
      },
      "ㅆ-16": {
        "green": 2
      },
      "ㅆ-17": {
        "green": 2
      },
      "ㅈ-17": {
        "green": 2
      },
      "ㅈ-16": {
        "green": 2
      },
      "ㅉ-16": {
        "green": 2
      },
      "ㅉ-17": {
        "green": 2
      },
      "ㅊ-16": {
        "green": 2
      },
      "ㅊ-17": {
        "green": 2
      },
      "ㅋ-17": {
        "green": 2
      },
      "ㅋ-16": {
        "green": 2
      },
      "ㅌ-16": {
        "green": 2
      },
      "ㅌ-17": {
        "green": 2
      },
      "ㅍ-17": {
        "green": 2
      },
      "ㅍ-16": {
        "green": 2
      },
      "ㅎ-16": {
        "green": 2
      },
      "ㅎ-17": {
        "green": 2
      },
      "ㄱ-19": {
        "green": 2
      },
      "ㄲ-19": {
        "green": 2
      },
      "ㄴ-19": {
        "green": 2
      },
      "ㄷ-19": {
        "green": 2
      },
      "ㄸ-19": {
        "green": 2
      },
      "ㄹ-19": {
        "red": true,
        "green": 2,
        "note": "English \"R\" sound instead of standard spanish \"R\"."
      },
      "ㅁ-19": {
        "green": 2
      },
      "ㅂ-19": {
        "green": 2
      },
      "ㅃ-19": {
        "green": 2
      },
      "ㅅ-19": {
        "green": 2
      },
      "ㅆ-19": {
        "green": 2
      },
      "ㅈ-19": {
        "green": 2
      },
      "ㅉ-19": {
        "green": 2
      },
      "ㅊ-19": {
        "green": 2
      },
      "ㅋ-19": {
        "green": 2
      },
      "ㅌ-19": {
        "green": 2
      },
      "ㅍ-19": {
        "green": 2
      },
      "ㅎ-19": {
        "green": 2
      },
      "ㅇ-13": {
        "red": false,
        "green": 1
      },
      "ㅊ-13": {
        "red": false,
        "green": 1,
        "note": ""
      },
      "ㅉ-11": {
        "red": false,
        "green": 1,
        "note": ""
      },
      "ㅇ-16": {
        "red": false,
        "green": 2,
        "note": ""
      },
      "ㅇ-17": {
        "red": false,
        "green": 2,
        "note": ""
      },
      "ㅇ-19": {
        "red": false,
        "green": 2,
        "note": ""
      }
    }
  }

  init() {
    this.setupFloatingNote();
    this.loadHighlights();
    this.loadGreenNotes();
    this.renderGrid();
    this.renderNotes();
    this.renderGreenNotes();
    this.setupButtons();
    this.setupGreenNoteEditing();
  }

  setupFloatingNote() {
    this.floatingNote.style.position = "absolute";
    this.floatingNote.style.display = "none";
    this.floatingNote.style.zIndex = 1000;

    this.floatingNote.addEventListener("input", e => {
      if (!this.currentCellId) return;
      this.highlights[this.currentCellId].note = this.floatingNote.value;
      this.saveHighlights();
      this.renderNotes();
    });

    this.floatingNote.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        this.floatingNote.style.display = "none";
        this.currentCellId = null;
      }
    });

    document.addEventListener("click", e => {
      if (this.floatingNote.style.display === "block" && !this.floatingNote.contains(e.target)) {
        this.floatingNote.style.display = "none";
        this.currentCellId = null;
      }
    });
  }

  loadHighlights() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.highlights = JSON.parse(saved);
    } else {
      // Use the default highlights if nothing saved
      this.highlights = { ...this.defaultHighlights };
      this.saveHighlights(); // optional, to initialize storage
    }
  }

  loadGreenNotes() {
    const saved = localStorage.getItem("greenNotes");
    this.greenNotes = saved ? JSON.parse(saved) : { ...this.defaultGreenNotes };
  }

  saveGreenNotes() {
    localStorage.setItem("greenNotes", JSON.stringify(this.greenNotes));
  }

  saveHighlights() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.highlights));
  }

  composeHangul(chosungIndex, jungseongIndex, jongseongIndex = 0) {
    return String.fromCharCode(0xAC00 + chosungIndex * 21 * 28 + jungseongIndex * 28 + jongseongIndex);
  }

  renderRow(consonant, cIndex, isReference = false) {
    const row = document.createElement("div");
    row.className = "row";
    if (isReference) row.classList.add("reference-row");

    this.vowels.forEach(vowelObj => {
      const vowel = vowelObj.char;
      const fileNumber = vowelObj.file;
      const jIndex = this.unicodeJungseongIndex[vowel];
      const syllable = this.composeHangul(cIndex, jIndex);

      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = syllable;
      const cellId = `${consonant}-${fileNumber}`;
      cell.dataset.id = cellId;

      const redMarker = document.createElement("div");
      redMarker.className = "marker red";
      const greenMarker = document.createElement("div");
      greenMarker.className = "marker green";

      cell.appendChild(redMarker);
      cell.appendChild(greenMarker);

      const state = this.highlights[cellId] || this.defaultHighlights[cellId] || { red: false, green: 0, note: "" };
      cell.classList.remove("highlight", "green-1", "green-2", "green-3");
      if (state.red) cell.classList.add("highlight");
      if (state.green > 0) cell.classList.add(`green-${state.green}`);

      cell.addEventListener("click", e => {
        if (e.target === redMarker || e.target === greenMarker) return;
        this.audio.src = `sounds/${this.folderMap[consonant]}/${fileNumber}.wav`;
        this.audio.currentTime = 0;
        this.audio.play();
      });

      redMarker.addEventListener("click", e => this.toggleRed(cell, cellId, redMarker, e));
      greenMarker.addEventListener("click", e => this.cycleGreen(cell, cellId, e));

      row.appendChild(cell);
    });

    this.grid.appendChild(row);

    if (isReference) {
      const spacer = document.createElement("div");
      spacer.className = "row-spacer";
      this.grid.appendChild(spacer);
    }
  }

  renderGrid() {
    this.grid.innerHTML = "";
    this.choseong.forEach(consonant => {
      const cIndex = this.unicodeChoseongIndex[consonant];
      const isRef = consonant === "ㅇ";
      this.renderRow(consonant, cIndex, isRef);
    });
  }

  toggleRed(cell, cellId, redMarker, e) {
    e.stopPropagation();
    const current = this.highlights[cellId] || { red: false, green: 0, note: "" };
    current.red = !current.red;

    if (current.red) cell.classList.add("highlight");
    else cell.classList.remove("highlight");

    if (!current.red && current.green === 0 && !current.note) delete this.highlights[cellId];
    else this.highlights[cellId] = current;

    this.saveHighlights();
    this.renderNotes();
    this.renderGreenNotes(); // <-- add this
  }

  cycleGreen(cell, cellId, e) {
    e.stopPropagation();
    const current = this.highlights[cellId] || { red: false, green: 0, note: "" };
    current.green = (current.green + 1) % 4;

    cell.classList.remove("green-1", "green-2", "green-3");
    if (current.green > 0) cell.classList.add(`green-${current.green}`);

    if (!current.red && current.green === 0 && !current.note) delete this.highlights[cellId];
    else this.highlights[cellId] = current;

    this.saveHighlights();
    this.renderNotes();
    this.renderGreenNotes(); // <-- add this
  }

  renderNotes() {
    const list = document.getElementById("notesList");
    list.innerHTML = "";

    this.choseong.forEach(consonant => {
      const cIndex = this.unicodeChoseongIndex[consonant];

      this.vowels.forEach(vowelObj => {
        const fileNumber = vowelObj.file;
        const cellId = `${consonant}-${fileNumber}`;
        const state = this.highlights[cellId];

        if (!state || !state.red || !state.note || !state.note.trim()) return;

        const jIndex = this.unicodeJungseongIndex[vowelObj.char];
        const syllable = this.composeHangul(cIndex, jIndex);

        const li = document.createElement("li");
        li.textContent = `${syllable}: ${state.note}`;
        list.appendChild(li);
      });
    });
  }

  renderGreenNotes() {
    Object.keys(this.greenNotes).forEach(level => {
      const noteContainer = document.querySelector(`.green-note[data-green='${level}']`);
      if (!noteContainer) return;

      // Check if at least one cell uses this green level
      const hasGreenCells = Object.values(this.highlights).some(h => h.green == level);
      noteContainer.style.display = hasGreenCells ? "block" : "none";

      // Ensure .green-note-text exists
      let textEl = noteContainer.querySelector(".green-note-text");
      if (!textEl) {
        textEl = document.createElement("div");
        textEl.className = "green-note-text";
        textEl.dataset.green = level;
        noteContainer.appendChild(textEl);
      }

      textEl.textContent = this.greenNotes[level] || "Click to add note";

      // Click to edit
      textEl.onclick = () => {
        const textarea = document.createElement("textarea");
        textarea.className = "green-note-editor";
        textarea.value = this.greenNotes[level] || "";
        textEl.replaceWith(textarea);
        textarea.focus();

        const finishEdit = () => {
          this.greenNotes[level] = textarea.value.trim();
          this.saveGreenNotes();
          textarea.replaceWith(textEl);
          textEl.textContent = this.greenNotes[level] || "Click to add note";
          this.renderGreenNotes(); // update visibility
        };

        textarea.onblur = finishEdit;
        textarea.onkeydown = (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            finishEdit();
          }
        };
      };
    });
  }

  setupButtons() {
    document.getElementById("resetBtn").addEventListener("click", () => {
      localStorage.removeItem(this.STORAGE_KEY);
      this.highlights = { ...this.defaultHighlights };
      this.renderGrid();
      this.renderNotes();
    });

    document.getElementById("exportBtn").addEventListener("click", () => {
      console.log("this.defaultHighlights =", JSON.stringify(this.highlights, null, 2));
      console.log("this.defaultGreenNotes =", JSON.stringify(this.greenNotes, null, 2));
    });
  }

  setupGreenNoteEditing() {
    document.addEventListener("click", e => {
      const el = e.target;
      if (!el.classList.contains("green-note-text")) return;

      const level = el.dataset.green;

      // Avoid opening multiple textareas
      if (document.querySelector(".green-note-editor")) return;

      const textarea = document.createElement("textarea");
      textarea.value = el.textContent === "Click to add note" ? "" : el.textContent;
      textarea.className = "green-note-editor";

      el.replaceWith(textarea);
      textarea.focus();

      const replaceWithTextDiv = () => {
        const newDiv = document.createElement("div");
        newDiv.className = "green-note-text";
        newDiv.dataset.green = level;
        newDiv.textContent = this.greenNotes[level] || "Click to add note";
        textarea.replaceWith(newDiv);
      };

      textarea.addEventListener("blur", () => {
        this.greenNotes[level] = textarea.value.trim();
        this.saveGreenNotes();
        replaceWithTextDiv();
        this.renderGreenNotes(); // update visibility if needed
      });

      // Optional: pressing Enter could also finish editing
      textarea.addEventListener("keydown", ev => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          textarea.blur();
        }
      });
    });
  }
}

const hangulGrid = new HangulGrid();
hangulGrid.init();
