# JLPT N5 Vocab — app outline for a newbie

The current version is a **website** in `web/`. Run it with `cd web && npm install && npm run dev`. You do not need Android Studio.

Learn includes the original starter flashcards, a **typed full N5 list** that uses the same flashcard layout (OpenJLPT, CC BY 4.0), and **534 picture cards** from your N5 PDF.

Then use [PROGRESS.md](../PROGRESS.md) as a checklist. An older Android project still exists in `app/`; you can ignore it.

## What you are building

A simple Japanese vocabulary **website** for **JLPT N5** (the first official Japanese test level).

The look is based on the rain (雨) study card:

1. Big kanji with hiragana, romaji, and English meaning
2. A short scene / speech-bubble story
3. A **Memory tip**
4. **Example sentences** with furigana (small readings above kanji)

The app stays on the phone. There is no login and no internet requirement.

## The three sections

| Tab | What it is for | What you do |
| --- | --- | --- |
| **Learn** | Study | Browse N5 words, open a card, read the mnemonic and sentences |
| **Practice** | Test yourself | Meaning quiz, reading quiz, or mixed quiz (8 questions) |
| **Progress** | See how you are doing | Cards opened, words marked known, quiz scores |

Learn and Practice are the two study modes you asked for. Progress is the third section so you can see whether studying is working.

## Screens (what the user sees)

```
Bottom tabs
├── Learn
│   └── Word list (filter by category)
│       └── Word card (雨-style flashcard)
├── Practice
│   └── Choose quiz type
│       └── Question → feedback → next
│           └── Score screen
└── Progress
    └── Stats + “what to do next” tip
```

## Data inside one word

Each vocabulary item stores:

- `kanji` — 雨
- `hiragana` — あめ
- `romaji` — ame / u
- `meaning` — RAIN
- `category` — Nature, People, Time, School, Daily life, Adjectives
- `sceneCaption` — short story that uses the word
- `mnemonicHook` + `mnemonicBody` — memory tip
- `examples` — three sentences, each with ruby (furigana) tokens and English

Starter catalog: illustrated teaching cards including 雨. The rest of N5 is the typed OpenJLPT list in Learn → **Full N5 list**.

## How the code is organized

Think of three layers:

1. **Data** — the words and saved progress  
   `app/src/main/java/com/japvocab/n5/data/`
2. **UI** — Compose screens  
   `app/src/main/java/com/japvocab/n5/ui/`
3. **App entry** — Android starts `MainActivity`, which shows `JapVocabAppRoot`

Important files:

| File | Role |
| --- | --- |
| `data/Models.kt` | Shapes of a word, sentence, quiz, progress |
| `data/VocabularyCatalog.kt` | All N5 words in this first version |
| `data/ProgressRepository.kt` | Saves progress on the phone (DataStore) |
| `ui/screens/LearnScreen.kt` | Word list |
| `ui/screens/WordDetailScreen.kt` | The flashcard (reference layout) |
| `ui/screens/PracticeScreen.kt` | Quiz picker |
| `ui/screens/QuizScreen.kt` | Questions and score |
| `ui/screens/ProgressScreen.kt` | Stats |
| `ui/theme/Theme.kt` | Green N5 colors from the reference art |

Progress is stored locally. If the user uninstalls the app, stats reset.

## Tech (why these choices)

- **Kotlin + Jetpack Compose** — current standard for new Android apps
- **Material 3** — buttons, navigation bar, chips
- **Navigation Compose** — moving between list, card, and quiz
- **DataStore** — remember “known” words and quiz scores
- **minSdk 26** — Android 8 and newer

No backend. A newbie can run the whole app from Android Studio.

## How to run it (your next practical step)

1. Install [Android Studio](https://developer.android.com/studio) (Ladybug or newer is fine).
2. Open this folder as a project (`File → Open`).
3. Wait for Gradle sync.
4. Plug in a phone with USB debugging, or start an emulator (Pixel + API 34 is a good default).
5. Press **Run**.

If Studio asks for an SDK, accept the default Android SDK install.

## How to add a new word later

1. Open `VocabularyCatalog.kt`.
2. Copy one existing function, for example `rain()`.
3. Change id, kanji, readings, meaning, mnemonic, and three examples.
4. Add `yourNewWord()` to the `words` list at the top.
5. Run the app. The word appears under **Learn**.

## What this first version does not include

On purpose, to keep the first version simple:

- No audio / native speaker recordings
- No full official N5 word list
- No handwriting practice
- No cloud backup
- No anime illustration files (the scene is a colored banner + speech bubble, same information as the reference card)

Those are good “next features” after you can install and use the three tabs.
