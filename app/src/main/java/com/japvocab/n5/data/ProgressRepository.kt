package com.japvocab.n5.data

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "n5_progress")

class ProgressRepository(private val context: Context) {
    private val viewedKey = stringSetPreferencesKey("viewed_ids")
    private val knownKey = stringSetPreferencesKey("known_ids")
    private val quizzesKey = intPreferencesKey("quizzes_taken")
    private val correctKey = intPreferencesKey("correct_answers")
    private val attemptedKey = intPreferencesKey("answers_attempted")
    private val lastScoreKey = intPreferencesKey("last_score_percent")

    val progress: Flow<LearnerProgress> = context.dataStore.data.map { prefs ->
        LearnerProgress(
            viewedIds = prefs[viewedKey].orEmpty(),
            knownIds = prefs[knownKey].orEmpty(),
            quizzesTaken = prefs[quizzesKey] ?: 0,
            correctAnswers = prefs[correctKey] ?: 0,
            answersAttempted = prefs[attemptedKey] ?: 0,
            lastScorePercent = prefs[lastScoreKey] ?: 0,
        )
    }

    suspend fun markViewed(wordId: String) {
        context.dataStore.edit { prefs ->
            prefs[viewedKey] = prefs[viewedKey].orEmpty() + wordId
        }
    }

    suspend fun toggleKnown(wordId: String) {
        context.dataStore.edit { prefs ->
            val current = prefs[knownKey].orEmpty()
            prefs[knownKey] = if (wordId in current) current - wordId else current + wordId
        }
    }

    suspend fun recordQuiz(correct: Int, total: Int) {
        context.dataStore.edit { prefs ->
            prefs[quizzesKey] = (prefs[quizzesKey] ?: 0) + 1
            prefs[correctKey] = (prefs[correctKey] ?: 0) + correct
            prefs[attemptedKey] = (prefs[attemptedKey] ?: 0) + total
            prefs[lastScoreKey] = if (total == 0) 0 else (correct * 100) / total
        }
    }
}

object QuizFactory {
    fun build(mode: PracticeMode, count: Int = 8): List<QuizQuestion> {
        val pool = VocabularyCatalog.words.shuffled()
        val selected = pool.take(count.coerceAtMost(pool.size))
        return selected.map { word ->
            when (mode) {
                PracticeMode.MEANING -> meaningQuestion(word, pool)
                PracticeMode.READING -> readingQuestion(word, pool)
                PracticeMode.MIXED -> if (listOf(true, false).random()) {
                    meaningQuestion(word, pool)
                } else {
                    readingQuestion(word, pool)
                }
            }
        }
    }

    private fun meaningQuestion(word: VocabWord, pool: List<VocabWord>): QuizQuestion {
        val distractors = pool
            .filter { it.id != word.id }
            .map { titleCase(it.meaning) }
            .distinct()
            .shuffled()
            .take(3)
        val correct = titleCase(word.meaning)
        val options = (distractors + correct).shuffled()
        return QuizQuestion(
            word = word,
            prompt = word.kanji,
            promptHint = "What does this mean?",
            options = options,
            correctIndex = options.indexOf(correct),
        )
    }

    private fun readingQuestion(word: VocabWord, pool: List<VocabWord>): QuizQuestion {
        val distractors = pool
            .filter { it.id != word.id }
            .map { it.hiragana }
            .distinct()
            .shuffled()
            .take(3)
        val options = (distractors + word.hiragana).shuffled()
        return QuizQuestion(
            word = word,
            prompt = word.kanji,
            promptHint = "Choose the reading (hiragana)",
            options = options,
            correctIndex = options.indexOf(word.hiragana),
        )
    }

    private fun titleCase(value: String): String =
        value.lowercase().replaceFirstChar { it.titlecase() }
}
