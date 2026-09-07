# JLPT N5 Vocab

Android app for learning beginner Japanese vocabulary (JLPT N5).

Three tabs:

- **Learn** — flashcards in the style of a study poster (kanji, readings, memory tip, example sentences)
- **Practice** — meaning / reading / mixed quizzes
- **Progress** — words opened, known words, quiz scores

## Newbie start here

1. [docs/APP_OUTLINE.md](docs/APP_OUTLINE.md) — what the app is, how it is structured, how to add a word  
2. [PROGRESS.md](PROGRESS.md) — checklist of done vs next steps  
3. Open this folder in Android Studio and press Run

## Requirements

- Android Studio
- JDK 17
- Android device or emulator, API 26+

## Project layout

```
app/src/main/java/com/japvocab/n5/
  MainActivity.kt          # starts the UI
  data/                    # words + saved progress
  ui/screens/              # Learn, Practice, Progress, quiz, card
  ui/theme/                # N5 green palette
```
