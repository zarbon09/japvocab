package com.japvocab.n5.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import androidx.compose.material3.Typography

val N5Green = Color(0xFF2F7A45)
val N5GreenDark = Color(0xFF215533)
val N5GreenSoft = Color(0xFFDCEFDD)
val Cream = Color(0xFFF6F1E4)
val Paper = Color(0xFFFFFBF3)
val BrownText = Color(0xFF5C3A24)
val PinkBar = Color(0xFFE8A0B4)
val PinkSoft = Color(0xFFFBE7EE)
val Gold = Color(0xFFE8C15A)
val Ink = Color(0xFF2B2B2B)

private val colors = lightColorScheme(
    primary = N5Green,
    onPrimary = Color.White,
    secondary = PinkBar,
    background = Cream,
    surface = Paper,
    onBackground = Ink,
    onSurface = Ink,
)

private val typography = Typography(
    displayLarge = TextStyle(
        fontFamily = FontFamily.Serif,
        fontWeight = FontWeight.Bold,
        fontSize = 72.sp,
        color = N5GreenDark,
    ),
    headlineMedium = TextStyle(
        fontWeight = FontWeight.Bold,
        fontSize = 22.sp,
        color = BrownText,
    ),
    bodyLarge = TextStyle(
        fontSize = 16.sp,
        color = Ink,
        lineHeight = 24.sp,
    ),
)

@Composable
fun JapVocabTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = colors,
        typography = typography,
        content = content,
    )
}
