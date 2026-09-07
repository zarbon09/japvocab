package com.japvocab.n5

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.japvocab.n5.ui.JapVocabAppRoot
import com.japvocab.n5.ui.theme.Cream
import com.japvocab.n5.ui.theme.JapVocabTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val repo = (application as JapVocabApp).progressRepository
        setContent {
            JapVocabTheme {
                Surface(modifier = Modifier.fillMaxSize(), color = Cream) {
                    JapVocabAppRoot(progressRepository = repo)
                }
            }
        }
    }
}
