package com.japvocab.n5.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.japvocab.n5.data.LearnerProgress
import com.japvocab.n5.data.VocabWord
import com.japvocab.n5.data.VocabularyCatalog
import com.japvocab.n5.ui.theme.BrownText
import com.japvocab.n5.ui.theme.N5Green
import com.japvocab.n5.ui.theme.N5GreenDark
import com.japvocab.n5.ui.theme.N5GreenSoft
import com.japvocab.n5.ui.theme.Paper

@Composable
fun LearnScreen(
    progress: LearnerProgress,
    onOpenWord: (String) -> Unit,
) {
    var category by rememberSaveable { mutableStateOf("All") }
    val categories = listOf("All") + VocabularyCatalog.categories()
    val visible = VocabularyCatalog.words.filter {
        category == "All" || it.category == category
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Text("JLPT N5", color = N5Green, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Text("Learn", fontWeight = FontWeight.ExtraBold, fontSize = 32.sp, color = BrownText)
            Text(
                "Open a card. Study the kanji, the memory tip, then the example sentences.",
                color = Color(0xFF666666),
                modifier = Modifier.padding(top = 4.dp, bottom = 8.dp),
            )
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                categories.take(4).forEach { name ->
                    FilterChip(
                        selected = category == name,
                        onClick = { category = name },
                        label = { Text(name) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = N5Green,
                            selectedLabelColor = Color.White,
                        ),
                    )
                }
            }
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                categories.drop(4).forEach { name ->
                    FilterChip(
                        selected = category == name,
                        onClick = { category = name },
                        label = { Text(name) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = N5Green,
                            selectedLabelColor = Color.White,
                        ),
                    )
                }
            }
        }
        items(visible, key = { it.id }) { word ->
            WordRow(
                word = word,
                viewed = word.id in progress.viewedIds,
                known = word.id in progress.knownIds,
                onClick = { onOpenWord(word.id) },
            )
        }
    }
}

@Composable
private fun WordRow(
    word: VocabWord,
    viewed: Boolean,
    known: Boolean,
    onClick: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(Paper)
            .clickable(onClick = onClick)
            .padding(14.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier
                .size(64.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(N5GreenSoft),
            contentAlignment = Alignment.Center,
        ) {
            Text(word.kanji, fontSize = 28.sp, fontFamily = FontFamily.Serif, color = N5GreenDark)
        }
        Column(modifier = Modifier.padding(start = 14.dp).weight(1f)) {
            Text(word.hiragana, fontSize = 13.sp, color = N5Green)
            Text(word.meaning, fontWeight = FontWeight.Bold, color = BrownText, fontSize = 18.sp)
            Text(word.romaji, fontSize = 12.sp, color = Color(0xFF777777))
        }
        Column(horizontalAlignment = Alignment.End) {
            Text(word.category, fontSize = 11.sp, color = Color(0xFF888888))
            if (known) {
                Icon(Icons.Filled.CheckCircle, contentDescription = "Known", tint = N5Green)
            } else if (viewed) {
                Box(
                    modifier = Modifier
                        .padding(top = 6.dp)
                        .size(10.dp)
                        .clip(CircleShape)
                        .background(N5Green),
                )
            }
        }
    }
}
