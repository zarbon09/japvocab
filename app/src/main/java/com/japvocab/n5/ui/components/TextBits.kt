package com.japvocab.n5.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.offset
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.japvocab.n5.data.RubyToken
import com.japvocab.n5.ui.theme.N5GreenDark

@Composable
fun FuriganaSentence(tokens: List<RubyToken>, modifier: Modifier = Modifier) {
    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.Start,
        verticalAlignment = Alignment.Bottom,
    ) {
        tokens.forEach { token ->
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = token.reading.orEmpty(),
                    fontSize = 10.sp,
                    color = Color(0xFF6B6B6B),
                    modifier = Modifier.offset(y = 2.dp),
                )
                Text(
                    text = token.text,
                    fontSize = 20.sp,
                    fontWeight = if (token.highlight) FontWeight.Bold else FontWeight.Medium,
                    color = if (token.highlight) N5GreenDark else Color(0xFF222222),
                )
            }
        }
    }
}

@Composable
fun HighlightedCaption(
    text: String,
    highlights: List<String>,
    modifier: Modifier = Modifier,
) {
    val annotated = buildAnnotatedString {
        var remaining = text
        while (remaining.isNotEmpty()) {
            val hit = highlights
                .mapNotNull { word ->
                    val index = remaining.indexOf(word, ignoreCase = true)
                    if (index >= 0) Triple(index, word.length, remaining.substring(index, index + word.length)) else null
                }
                .minByOrNull { it.first }
            if (hit == null) {
                append(remaining)
                break
            }
            append(remaining.substring(0, hit.first))
            withStyle(SpanStyle(color = N5GreenDark, fontWeight = FontWeight.Bold)) {
                append(hit.third)
            }
            remaining = remaining.substring(hit.first + hit.second)
        }
    }
    Text(text = annotated, modifier = modifier, fontSize = 15.sp, lineHeight = 22.sp)
}

@Composable
fun RibbonBadge(text: String, color: Color, modifier: Modifier = Modifier) {
    Box(modifier = modifier) {
        Text(
            text = text,
            color = Color.White,
            fontWeight = FontWeight.Bold,
            fontSize = 12.sp,
        )
    }
}
