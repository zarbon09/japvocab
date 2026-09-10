# JLPT N5 Vocab (website)

A simple **website** for learning beginner Japanese vocabulary (JLPT N5). Use this in a browser. You do **not** need Android Studio.

Three tabs:

- **Learn** — flashcards. Filters: starter cards, the full typed N5 list (OpenJLPT), and picture cards from your PDF
- **Practice** — meaning / reading / mixed quizzes on typed words (not PDF pictures)
- **Progress** — words opened, known words, quiz scores

Progress is saved in your browser (`localStorage`). No login.

## How to run (newbie)

1. Install [Node.js](https://nodejs.org/) (LTS). This also installs `npm`.
2. Open a terminal in this project folder.
3. Run:

```bash
cd web
npm install
npm run dev
```

4. Open the URL it prints, usually [http://localhost:5173](http://localhost:5173).

That is the whole setup. If you still have Android Studio open from the earlier plan, you can close it.

## What to try first

1. Learn → filter **Starter cards** → **雨** (rain). Or open **Full N5 list** for the rest of N5.
2. Mark a word as known
3. Practice → mixed quiz
4. Check Progress

## Word lists

- **Starter cards** — a small illustrated set (雨, 青, …) with memory tips.
- **Full N5 list** — typed JLPT N5 vocabulary from [OpenJLPT](https://github.com/evanclan/OpenJLPT) (CC BY 4.0). These cards use the word, reading, meaning, and example sentences. They do not reuse the PDF artwork.
- **From your PDF** — picture cards extracted from your book. Study them as images.

Practice quizzes use starter + full N5 typed cards only. PDF cards stay in Learn because they are pictures, not quiz text.

## Optional

The old Android project files are still in this repo, but the current plan is the website. Ignore the `app/` Android folder unless you come back to mobile later.

More detail: [docs/APP_OUTLINE.md](docs/APP_OUTLINE.md) · checklist: [PROGRESS.md](PROGRESS.md)
