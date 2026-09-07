package com.japvocab.n5.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.japvocab.n5.data.PracticeMode
import com.japvocab.n5.ui.theme.BrownText
import com.japvocab.n5.ui.theme.N5Green
import com.japvocab.n5.ui.theme.Paper

@Composable
fun PracticeScreen(onStart: (PracticeMode) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("JLPT N5", color = N5Green, fontWeight = FontWeight.Bold, fontSize = 14.sp)
        Text("Practice", fontWeight = FontWeight.ExtraBold, fontSize = 32.sp, color = BrownText)
        Text(
            "8 quick questions. No typing required — tap the answer, then see if you were right.",
            color = Color(0xFF666666),
        )
        Spacer(Modifier.height(8.dp))
        ModeCard(
            title = "Meaning quiz",
            body = "See the kanji. Pick the English meaning.",
            onClick = { onStart(PracticeMode.MEANING) },
        )
        ModeCard(
            title = "Reading quiz",
            body = "See the kanji. Pick the hiragana reading.",
            onClick = { onStart(PracticeMode.READING) },
        )
        ModeCard(
            title = "Mixed quiz",
            body = "A mix of meaning and reading questions.",
            onClick = { onStart(PracticeMode.MIXED) },
        )
    }
}

@Composable
private fun ModeCard(title: String, body: String, onClick: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(Paper)
            .clickable(onClick = onClick)
            .padding(18.dp),
    ) {
        Text(title, fontWeight = FontWeight.Bold, fontSize = 20.sp, color = BrownText)
        Text(body, modifier = Modifier.padding(top = 6.dp), color = Color(0xFF555555))
        Text("Start →", color = N5Green, fontWeight = FontWeight.Bold, modifier = Modifier.padding(top = 10.dp))
    }
}
