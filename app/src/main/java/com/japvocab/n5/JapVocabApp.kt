package com.japvocab.n5

import android.app.Application
import com.japvocab.n5.data.ProgressRepository

class JapVocabApp : Application() {
    lateinit var progressRepository: ProgressRepository
        private set

    override fun onCreate() {
        super.onCreate()
        progressRepository = ProgressRepository(this)
    }
}
