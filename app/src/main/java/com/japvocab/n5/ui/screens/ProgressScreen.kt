package com.japvocab.n5.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.japvocab.n5.data.LearnerProgress
import com.japvocab.n5.data.VocabularyCatalog
import com.japvocab.n5.ui.theme.BrownText
import com.japvocab.n5.ui.theme.N5Green
import com.japvocab.n5.ui.theme.N5GreenSoft
import com.japvocab.n5.ui.theme.Paper

@Composable
fun ProgressScreen(progress: LearnerProgress) {
    val total = VocabularyCatalog.words.size
    val viewed = progress.viewedIds.size.coerceAtMost(total)
    val known = progress.knownIds.size.coerceAtMost(total)
    val accuracy = if (progress.answersAttempted == 0) {
        0
    } else {
        (progress.correctAnswers * 100) / progress.answersAttempted
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("JLPT N5", color = N5Green, fontWeight = FontWeight.Bold, fontSize = 14.sp)
        Text("Progress", fontWeight = FontWeight.ExtraBold, fontSize = 32.sp, color = BrownText)
        StatCard("Cards opened", "$viewed / $total", viewed / total.toFloat())
        StatCard("Marked known", "$known / $total", known / total.toFloat())
        StatCard("Quiz accuracy", "$accuracy%", accuracy / 100f)
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
            MiniStat("Quizzes", "${progress.quizzesTaken}", Modifier.weight(1f))
            MiniStat("Last score", "${progress.lastScorePercent}%", Modifier.weight(1f))
        }
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(20.dp))
                .background(Paper)
                .padding(16.dp),
        ) {
            Text("What to do next", fontWeight = FontWeight.Bold, color = BrownText)
            Text(
                when {
                    viewed == 0 -> "Open Learn and study your first card. Start with 雨 (rain)."
                    known < 5 -> "Keep opening cards, then mark the ones you remember as known."
                    progress.quizzesTaken == 0 -> "You have studied a few words. Try a Practice quiz next."
                    accuracy < 70 -> "Review cards you missed, then take the mixed quiz again."
                    else -> "Nice work. Revisit Practice, then add more N5 words in the catalog later."
                },
                modifier = Modifier.padding(top = 8.dp),
                color = Color(0xFF555555),
            )
        }
    }
}

@Composable
private fun StatCard(label: String, value: String, fraction: Float) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(Paper)
            .padding(16.dp),
    ) {
        Text(label, color = Color(0xFF777777))
        Text(value, fontWeight = FontWeight.Bold, fontSize = 24.sp, color = BrownText)
        LinearProgressIndicator(
            progress = { fraction.coerceIn(0f, 1f) },
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
            color = N5Green,
            trackColor = N5GreenSoft,
        )
    }
}

@Composable
private fun MiniStat(label: String, value: String, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(20.dp))
            .background(Paper)
            .padding(16.dp),
    ) {
        Text(label, color = Color(0xFF777777))
        Text(value, fontWeight = FontWeight.Bold, fontSize = 22.sp, color = BrownText)
    }
}
