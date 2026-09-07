package com.japvocab.n5.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.japvocab.n5.data.LearnerProgress
import com.japvocab.n5.data.ProgressRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class AppViewModel(
    private val repository: ProgressRepository,
) : ViewModel() {
    val progress: StateFlow<LearnerProgress> = repository.progress.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = LearnerProgress(),
    )

    fun markViewed(wordId: String) {
        viewModelScope.launch { repository.markViewed(wordId) }
    }

    fun toggleKnown(wordId: String) {
        viewModelScope.launch { repository.toggleKnown(wordId) }
    }

    fun recordQuiz(correct: Int, total: Int) {
        viewModelScope.launch { repository.recordQuiz(correct, total) }
    }

    companion object {
        fun factory(repository: ProgressRepository) = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                return AppViewModel(repository) as T
            }
        }
    }
}
