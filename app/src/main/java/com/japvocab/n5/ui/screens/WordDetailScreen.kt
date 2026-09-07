package com.japvocab.n5.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.outlined.Lightbulb
import androidx.compose.material.icons.outlined.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.japvocab.n5.data.LearnerProgress
import com.japvocab.n5.data.VocabWord
import com.japvocab.n5.data.VocabularyCatalog
import com.japvocab.n5.ui.components.FuriganaSentence
import com.japvocab.n5.ui.components.HighlightedCaption
import com.japvocab.n5.ui.theme.BrownText
import com.japvocab.n5.ui.theme.Cream
import com.japvocab.n5.ui.theme.Gold
import com.japvocab.n5.ui.theme.N5Green
import com.japvocab.n5.ui.theme.N5GreenDark
import com.japvocab.n5.ui.theme.Paper
import com.japvocab.n5.ui.theme.PinkBar
import com.japvocab.n5.ui.theme.PinkSoft

@Composable
fun WordDetailScreen(
    wordId: String,
    progress: LearnerProgress,
    onBack: () -> Unit,
    onViewed: (String) -> Unit,
    onToggleKnown: (String) -> Unit,
) {
    val word = VocabularyCatalog.byId(wordId)
    LaunchedEffect(wordId) {
        if (word != null) onViewed(wordId)
    }
    if (word == null) {
        Column(Modifier.padding(24.dp)) {
            Text("Word not found")
            Button(onClick = onBack) { Text("Back") }
        }
        return
    }
    val known = word.id in progress.knownIds

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .background(Cream),
    ) {
        HeroCard(word = word, onBack = onBack)
        SceneBanner(word = word)
        MemoryTip(word = word)
        ExampleSection(word = word)
        Button(
            onClick = { onToggleKnown(word.id) },
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = if (known) N5GreenDark else N5Green,
            ),
            shape = RoundedCornerShape(16.dp),
        ) {
            Text(if (known) "Marked as known" else "Mark as known")
        }
        Spacer(Modifier.height(12.dp))
    }
}

@Composable
private fun HeroCard(word: VocabWord, onBack: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(word.sceneTint).copy(alpha = 0.22f))
            .padding(bottom = 8.dp),
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                }
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(topEnd = 10.dp, bottomEnd = 10.dp))
                        .background(N5Green)
                        .padding(horizontal = 12.dp, vertical = 6.dp),
                ) {
                    Text("JLPT N5", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            }
            Text(word.hiragana, fontSize = 18.sp, color = N5GreenDark)
            Text(
                word.kanji,
                fontSize = 86.sp,
                fontFamily = FontFamily.Serif,
                fontWeight = FontWeight.Bold,
                color = N5GreenDark,
                modifier = Modifier.padding(vertical = 4.dp),
            )
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(50))
                    .background(N5Green)
                    .padding(horizontal = 18.dp, vertical = 6.dp),
            ) {
                Text(word.romaji, color = Color.White, fontWeight = FontWeight.SemiBold)
            }
            Text(
                word.meaning,
                fontWeight = FontWeight.ExtraBold,
                fontSize = 28.sp,
                color = BrownText,
                modifier = Modifier.padding(top = 10.dp, bottom = 16.dp),
                letterSpacing = 2.sp,
            )
        }
    }
}

@Composable
private fun SceneBanner(word: VocabWord) {
    Box(
        modifier = Modifier
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .fillMaxWidth()
            .height(168.dp)
            .clip(RoundedCornerShape(24.dp))
            .background(Color(word.sceneTint)),
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val w = size.width
            val h = size.height
            drawCircle(Color.White.copy(alpha = 0.12f), radius = w * 0.22f, center = Offset(w * 0.8f, h * 0.2f))
            drawCircle(Color.White.copy(alpha = 0.08f), radius = w * 0.12f, center = Offset(w * 0.18f, h * 0.7f))
            val path = Path().apply {
                moveTo(0f, h * 0.78f)
                quadraticTo(w * 0.3f, h * 0.62f, w * 0.55f, h * 0.76f)
                quadraticTo(w * 0.8f, h * 0.9f, w, h * 0.7f)
                lineTo(w, h)
                lineTo(0f, h)
                close()
            }
            drawPath(path, Color.White.copy(alpha = 0.18f))
        }
        Box(
            modifier = Modifier
                .align(Alignment.TopStart)
                .padding(14.dp)
                .fillMaxWidth(0.72f)
                .clip(RoundedCornerShape(18.dp))
                .background(Color.White.copy(alpha = 0.92f))
                .padding(12.dp),
        ) {
            HighlightedCaption(text = word.sceneCaption, highlights = word.sceneHighlightWords)
        }
        Box(
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(12.dp)
                .size(54.dp)
                .clip(RoundedCornerShape(27.dp))
                .background(Color.White.copy(alpha = 0.9f)),
            contentAlignment = Alignment.Center,
        ) {
            Text("★", fontSize = 24.sp, color = N5GreenDark)
        }
    }
}

@Composable
private fun MemoryTip(word: VocabWord) {
    Column(
        modifier = Modifier
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(Paper)
            .padding(16.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Outlined.Lightbulb, contentDescription = null, tint = Gold, modifier = Modifier.size(28.dp))
            Spacer(Modifier.width(8.dp))
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(N5Green)
                    .padding(horizontal = 10.dp, vertical = 4.dp),
            ) {
                Text("MEMORY TIP", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
            }
        }
        Spacer(Modifier.height(10.dp))
        Text(word.mnemonicHook, fontWeight = FontWeight.ExtraBold, fontSize = 20.sp, color = N5GreenDark)
        Text(word.mnemonicBody, modifier = Modifier.padding(top = 6.dp), color = Color(0xFF444444))
    }
}

@Composable
private fun ExampleSection(word: VocabWord) {
    Column(
        modifier = Modifier
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(Paper),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(PinkBar)
                .padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(Icons.Outlined.Star, contentDescription = null, tint = Color.White)
            Spacer(Modifier.width(8.dp))
            Text("EXAMPLE SENTENCES", color = Color.White, fontWeight = FontWeight.Bold)
        }
        word.examples.forEachIndexed { index, example ->
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(if (index % 2 == 0) Paper else PinkSoft)
                    .padding(16.dp),
            ) {
                Text("${index + 1}.", fontWeight = FontWeight.Bold, color = PinkBar)
                FuriganaSentence(example.tokens)
                HighlightedCaption(
                    text = example.english,
                    highlights = listOfNotNull(example.englishHighlight),
                    modifier = Modifier.padding(top = 6.dp),
                )
            }
        }
    }
}
