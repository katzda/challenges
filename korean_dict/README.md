# Running the web app

## Docker

To build the image without starting a container:

```sh
./build
```

The build uses a temporary Docker CLI config by default so it doesn't need to
write Buildx state to `~/.docker`. Set `DOCKER_CONFIG` explicitly if you need
to use a custom Docker CLI config.

To build and start the app in one step, run:

```sh
./install
```

This builds the `korean-dict` image and starts the app at
<http://localhost:8000/>. To use another host port, set `PORT`:

```sh
PORT=8080 ./install
```

The script replaces the previous `korean-dict` container when run again. Stop
the app with `docker stop korean-dict`.

## Local development

Python 3 is sufficient; the server uses only the standard library. From the
project root, run:

```sh
python web/serve.py
```

Then open <http://localhost:8000/>.

# Korean Dictionary

This project contains a browser-based Korean dictionary and Hangul tools, plus
Python utilities for processing Korean subtitle text and building dictionary
data.

## Run Python scripts with Docker

Docker is required; Python and the project dependencies run inside the
container. From the project root, pass the script path and any script arguments
to `./run`:

```sh
./run src/tests.py
./run src/build_indexes.py
./run src/scrape_meanings.py
```

The runner mounts the project into the container, so generated files are
written back into the project. Its image is built automatically on first use
and reused on later runs.

## Python files

Run the command-line scripts from the project root unless noted otherwise.

### Data and dictionary utilities

- [`src/build_indexes.py`](src/build_indexes.py) reads
  `data/subtitles/ko.txt`, `starwars.txt`, and `chief.txt`, counts Korean words
  as decomposed Jamo strings, and writes frequency-, alphabet-, and
  length-sorted JSON indexes under `web/dictionary/indexes/`. Run with
  `python3 src/build_indexes.py`.
- [`src/scrape_meanings.py`](src/scrape_meanings.py) reads the filtered word
  index, composes each Jamo key into Hangul, and looks up English meanings on
  Wiktionary. Results are saved incrementally to
  `web/dictionary/indexes/ko_en.json`; existing entries are skipped. This
  script makes network requests and can take a long time. Run with
  `python3 src/scrape_meanings.py`.
- [`src/tests.py`](src/tests.py) is a print-based check of index search
  positions and Jamo decomposition/composition. It expects the generated index
  JSON files to exist. Run with `python3 src/tests.py`.
- [`src/Indexes.py`](src/Indexes.py) provides helpers used by the data scripts:
  subtitle word counting and cleaning, sorting and percentile filtering,
  binary search, and JSON/text input and output.
- [`src/JamoWord.py`](src/JamoWord.py) provides helpers to decompose Hangul
  syllables into Jamo and compose Jamo sequences back into Hangul, including
  compound vowels and final consonants.
- [`src/WiktionaryEnglishScraper.py`](src/WiktionaryEnglishScraper.py) contains
  the Wiktionary scraper used by `scrape_meanings.py`. It fetches and parses
  word pages, stores meanings in JSON, and supports retrying entries with no
  meanings.
- [`src/Hangulish.py`](src/Hangulish.py) contains English-letter/Jamo
  transliteration maps and conversion helpers. The conversion methods
  currently contain unresolved variable references, so they may not work as
  intended.

### Web server

- [`web/serve.py`](web/serve.py) serves the static files in `web/` over HTTP
  using Python's standard library. Run locally with `python3 web/serve.py`,
  then open <http://localhost:8000/>.

## Python dependencies

The data utilities use `jamo`, `wcwidth`, `requests`, and `beautifulsoup4`.
`web/serve.py` has no third-party dependencies.
