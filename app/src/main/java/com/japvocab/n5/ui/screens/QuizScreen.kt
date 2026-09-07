package com.japvocab.n5.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.japvocab.n5.data.PracticeMode
import com.japvocab.n5.data.QuizFactory
import com.japvocab.n5.ui.theme.BrownText
import com.japvocab.n5.ui.theme.N5Green
import com.japvocab.n5.ui.theme.N5GreenDark
import com.japvocab.n5.ui.theme.N5GreenSoft
import com.japvocab.n5.ui.theme.Paper
import com.japvocab.n5.ui.theme.PinkBar

@Composable
fun QuizScreen(
    mode: PracticeMode,
    onFinished: (correct: Int, total: Int) -> Unit,
    onClose: () -> Unit,
) {
    val questions = remember(mode) { QuizFactory.build(mode) }
    var index by remember { mutableIntStateOf(0) }
    var correctCount by remember { mutableIntStateOf(0) }
    var selected by remember { mutableStateOf<Int?>(null) }
    var finished by remember { mutableStateOf(false) }

    if (finished) {
        ResultPane(
            correct = correctCount,
            total = questions.size,
            onDone = { onFinished(correctCount, questions.size) },
        )
        return
    }

    val question = questions[index]
    val answered = selected != null

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
            Text("Question ${index + 1} / ${questions.size}", fontWeight = FontWeight.Bold, color = N5Green)
            Spacer(Modifier.weight(1f))
            TextButton(onClick = onClose) { Text("Exit") }
        }
        LinearProgressIndicator(
            progress = { (index + 1f) / questions.size },
            modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
            color = N5Green,
            trackColor = N5GreenSoft,
        )
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp)
                .clip(RoundedCornerShape(24.dp))
                .background(Paper)
                .padding(24.dp),
            contentAlignment = Alignment.Center,
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(question.promptHint, color = Color(0xFF777777))
                Text(
                    question.prompt,
                    fontSize = 72.sp,
                    fontFamily = FontFamily.Serif,
                    fontWeight = FontWeight.Bold,
                    color = N5GreenDark,
                )
            }
        }
        question.options.forEachIndexed { optionIndex, label ->
            val isCorrect = optionIndex == question.correctIndex
            val isPicked = selected == optionIndex
            val border = when {
                !answered -> Color(0xFFE6E0D4)
                isCorrect -> N5Green
                isPicked -> PinkBar
                else -> Color(0xFFE6E0D4)
            }
            val bg = when {
                !answered -> Paper
                isCorrect -> N5GreenSoft
                isPicked -> Color(0xFFFBE7EE)
                else -> Paper
            }
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .border(2.dp, border, RoundedCornerShape(16.dp))
                    .background(bg)
                    .clickable(enabled = !answered) {
                        selected = optionIndex
                        if (isCorrect) correctCount += 1
                    }
                    .padding(16.dp),
            ) {
                Text(label, fontSize = 18.sp, fontWeight = FontWeight.Medium, color = BrownText)
            }
        }
        Spacer(Modifier.height(12.dp))
        if (answered) {
            Button(
                onClick = {
                    if (index == questions.lastIndex) {
                        finished = true
                    } else {
                        index += 1
                        selected = null
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = N5Green),
                shape = RoundedCornerShape(16.dp),
            ) {
                Text(if (index == questions.lastIndex) "See score" else "Next")
            }
        }
    }
}

@Composable
private fun ResultPane(correct: Int, total: Int, onDone: () -> Unit) {
    val percent = if (total == 0) 0 else (correct * 100) / total
    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text("Quiz complete", fontWeight = FontWeight.Bold, fontSize = 28.sp, color = BrownText)
        Text("$correct / $total", fontSize = 48.sp, fontWeight = FontWeight.ExtraBold, color = N5GreenDark)
        Text("$percent%", color = Color(0xFF666666), modifier = Modifier.padding(bottom = 24.dp))
        Button(
            onClick = onDone,
            colors = ButtonDefaults.buttonColors(containerColor = N5Green),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text("Save and return")
        }
    }
}
