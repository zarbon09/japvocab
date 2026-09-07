# Progress tracker

Use this list to see **what is already done** and **what you should do next**. Check items off as you complete them on your computer.

Status key: **DONE** = already in this repo. **YOU** = you do this locally. **LATER** = optional after the first version works.

---

## Phase 0 — Understand the app (no coding)

- [x] **DONE** Decide the three sections: Learn, Practice, Progress
- [x] **DONE** Match the study card to the 雨 reference: kanji, readings, meaning, memory tip, example sentences
- [x] **DONE** Write the outline in `docs/APP_OUTLINE.md`
- [ ] **YOU** Read `docs/APP_OUTLINE.md` once, slowly
- [ ] **YOU** Skim `app/src/main/java/com/japvocab/n5/data/Models.kt` so the word shape feels familiar

---

## Phase 1 — Open the project

- [x] **DONE** Android Gradle project (`settings.gradle.kts`, `app/build.gradle.kts`)
- [x] **DONE** App id `com.japvocab.n5`, min Android 8
- [ ] **YOU** Install Android Studio
- [ ] **YOU** Open this repository folder
- [ ] **YOU** Let Gradle sync finish (first time can take several minutes)
- [ ] **YOU** Create an emulator or connect a phone
- [ ] **YOU** Press Run and confirm the three bottom tabs appear

If sync fails, Studio’s error is usually “SDK not found” or “JDK 17 required”. Install the Android SDK from Studio, and set JDK 17 in Settings → Build → Gradle.

---

## Phase 2 — Learn tab (study)

- [x] **DONE** Word list with category chips
- [x] **DONE** 22 starter N5 words
- [x] **DONE** Flashcard screen: N5 ribbon, big kanji, romaji pill, English meaning
- [x] **DONE** Scene speech bubble
- [x] **DONE** Memory tip box
- [x] **DONE** Example sentences with furigana
- [x] **DONE** “Mark as known”
- [ ] **YOU** Open **Learn → 雨** and compare it to the reference picture
- [ ] **YOU** Open two other words and mark one as known

---

## Phase 3 — Practice tab (quiz)

- [x] **DONE** Meaning quiz
- [x] **DONE** Reading quiz
- [x] **DONE** Mixed quiz
- [x] **DONE** Immediate correct / wrong coloring
- [x] **DONE** Score screen saved into Progress
- [ ] **YOU** Finish one mixed quiz
- [ ] **YOU** Open Progress and confirm last score updated

---

## Phase 4 — Progress tab

- [x] **DONE** Cards opened
- [x] **DONE** Marked known
- [x] **DONE** Quiz accuracy, quizzes taken, last score
- [x] **DONE** “What to do next” tip
- [ ] **YOU** Reset the app (uninstall) if you want a clean test, then study again

---

## Phase 5 — After it runs on your phone (optional next work)

Pick one. Do not try all of these at once.

- [ ] **LATER** Add 20 more N5 words in `VocabularyCatalog.kt`
- [ ] **LATER** Add audio (TTS is the easy first step: Android `TextToSpeech`)
- [ ] **LATER** Replace the colored scene banner with real illustrations
- [ ] **LATER** Add a “review known words” quiz that only uses marked words
- [ ] **LATER** Publish an internal APK to friends (Android Studio → Build → APK)

---

## Suggested order for you this week

1. Read the outline  
2. Run the app  
3. Study 雨, then 人, then 水  
4. Take a meaning quiz  
5. Add one new word yourself (that is the best way to learn the project)
