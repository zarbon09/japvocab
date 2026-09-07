package com.japvocab.n5.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AutoStories
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.Quiz
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.japvocab.n5.data.PracticeMode
import com.japvocab.n5.data.ProgressRepository
import com.japvocab.n5.ui.screens.LearnScreen
import com.japvocab.n5.ui.screens.PracticeScreen
import com.japvocab.n5.ui.screens.ProgressScreen
import com.japvocab.n5.ui.screens.QuizScreen
import com.japvocab.n5.ui.screens.WordDetailScreen
import com.japvocab.n5.ui.theme.Cream
import com.japvocab.n5.ui.theme.N5Green
import com.japvocab.n5.ui.theme.N5GreenDark
import com.japvocab.n5.ui.theme.Paper

private data class Tab(val route: String, val label: String, val icon: ImageVector)

private val tabs = listOf(
    Tab("learn", "Learn", Icons.Outlined.AutoStories),
    Tab("practice", "Practice", Icons.Outlined.Quiz),
    Tab("progress", "Progress", Icons.Outlined.BarChart),
)

@Composable
fun JapVocabAppRoot(progressRepository: ProgressRepository) {
    val navController = rememberNavController()
    val viewModel: AppViewModel = viewModel(
        factory = AppViewModel.factory(progressRepository),
    )
    val progress by viewModel.progress.collectAsStateWithLifecycle()
    val backStack by navController.currentBackStackEntryAsState()
    val current = backStack?.destination?.route.orEmpty()
    val showBar = current in tabs.map { it.route }

    Scaffold(
        containerColor = Cream,
        bottomBar = {
            if (showBar) {
                NavigationBar(containerColor = Paper) {
                    tabs.forEach { tab ->
                        NavigationBarItem(
                            selected = current == tab.route,
                            onClick = {
                                navController.navigate(tab.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            icon = { Icon(tab.icon, contentDescription = tab.label) },
                            label = { Text(tab.label) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = N5GreenDark,
                                selectedTextColor = N5GreenDark,
                                indicatorColor = Color(0xFFDCEFDD),
                            ),
                        )
                    }
                }
            }
        },
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = "learn",
            modifier = Modifier.padding(padding),
        ) {
            composable("learn") {
                LearnScreen(
                    progress = progress,
                    onOpenWord = { id -> navController.navigate("word/$id") },
                )
            }
            composable("practice") {
                PracticeScreen(
                    onStart = { mode -> navController.navigate("quiz/${mode.name}") },
                )
            }
            composable("progress") {
                ProgressScreen(progress = progress)
            }
            composable(
                route = "word/{id}",
                arguments = listOf(navArgument("id") { type = NavType.StringType }),
            ) { entry ->
                val id = entry.arguments?.getString("id").orEmpty()
                WordDetailScreen(
                    wordId = id,
                    progress = progress,
                    onBack = { navController.popBackStack() },
                    onViewed = viewModel::markViewed,
                    onToggleKnown = viewModel::toggleKnown,
                )
            }
            composable(
                route = "quiz/{mode}",
                arguments = listOf(navArgument("mode") { type = NavType.StringType }),
            ) { entry ->
                val mode = PracticeMode.valueOf(
                    entry.arguments?.getString("mode") ?: PracticeMode.MIXED.name,
                )
                QuizScreen(
                    mode = mode,
                    onFinished = { correct, total ->
                        viewModel.recordQuiz(correct, total)
                        navController.popBackStack()
                    },
                    onClose = { navController.popBackStack() },
                )
            }
        }
    }
}
