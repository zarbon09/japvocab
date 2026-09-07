package com.japvocab.n5.data

data class RubyToken(
    val text: String,
    val reading: String? = null,
    val highlight: Boolean = false,
)

data class ExampleSentence(
    val tokens: List<RubyToken>,
    val english: String,
    val englishHighlight: String? = null,
)

data class VocabWord(
    val id: String,
    val kanji: String,
    val hiragana: String,
    val romaji: String,
    val meaning: String,
    val category: String,
    val sceneCaption: String,
    val sceneHighlightWords: List<String>,
    val mnemonicHook: String,
    val mnemonicBody: String,
    val examples: List<ExampleSentence>,
    val sceneTint: Long,
)

enum class PracticeMode {
    MEANING,
    READING,
    MIXED,
}

data class QuizQuestion(
    val word: VocabWord,
    val prompt: String,
    val promptHint: String,
    val options: List<String>,
    val correctIndex: Int,
)

data class LearnerProgress(
    val viewedIds: Set<String> = emptySet(),
    val knownIds: Set<String> = emptySet(),
    val quizzesTaken: Int = 0,
    val correctAnswers: Int = 0,
    val answersAttempted: Int = 0,
    val lastScorePercent: Int = 0,
)
