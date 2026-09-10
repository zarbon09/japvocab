# JLPT N5 Vocab (website)

A simple **website** for learning beginner Japanese vocabulary (JLPT N5). Use this in a browser. You do **not** need Android Studio.

Three tabs:

- **Learn** — flashcards (kanji, readings, memory tip, example sentences)
- **Practice** — meaning / reading / mixed quizzes
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

1. Learn → **雨** (rain)
2. Mark a word as known
3. Practice → mixed quiz
4. Check Progress

## Optional

The old Android project files are still in this repo, but the current plan is the website. Ignore the `app/` Android folder unless you come back to mobile later.

More detail: [docs/APP_OUTLINE.md](docs/APP_OUTLINE.md) · checklist: [PROGRESS.md](PROGRESS.md)
