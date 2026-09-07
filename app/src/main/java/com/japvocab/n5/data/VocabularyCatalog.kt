package com.japvocab.n5.data

object VocabularyCatalog {
    val words: List<VocabWord> = listOf(
        rain(),
        person(),
        sunDay(),
        water(),
        fire(),
        mountain(),
        tree(),
        book(),
        eat(),
        see(),
        go(),
        big(),
        small(),
        schoolLearn(),
        time(),
        now(),
        friend(),
        car(),
        newWord(),
        buy(),
        drink(),
        cheap(),
    )

    fun byId(id: String): VocabWord? = words.firstOrNull { it.id == id }

    fun categories(): List<String> = words.map { it.category }.distinct()

    private fun t(text: String, reading: String? = null, highlight: Boolean = false) =
        RubyToken(text, reading, highlight)

    private fun rain() = VocabWord(
        id = "ame",
        kanji = "雨",
        hiragana = "あめ",
        romaji = "ame / u",
        meaning = "RAIN",
        category = "Nature",
        sceneCaption = "Look! There is rain everywhere. It's a real downpour! We must use our rain umbrella.",
        sceneHighlightWords = listOf("rain", "umbrella"),
        mnemonicHook = "AME = A-ME-lla",
        mnemonicBody = "Remember: AME = A-ME-lla (rhymes with Umbrella). When it rains, you need an umbrella!",
        sceneTint = 0xFF7BA7C9,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(
                    t("日本", "にほん"),
                    t("の"),
                    t("梅雨", "つゆ", highlight = true),
                    t("は"),
                    t("長い", "ながい"),
                    t("です。"),
                ),
                english = "The rainy season in Japan is long.",
                englishHighlight = "rainy season",
            ),
            ExampleSentence(
                tokens = listOf(
                    t("外", "そと"),
                    t("は"),
                    t("小雨", "こさめ", highlight = true),
                    t("が"),
                    t("降っています", "ふっています"),
                    t("。"),
                ),
                english = "It is drizzling outside.",
                englishHighlight = "drizzling",
            ),
            ExampleSentence(
                tokens = listOf(
                    t("私", "わたし"),
                    t("は"),
                    t("新しい", "あたらしい"),
                    t("雨傘", "あまがさ", highlight = true),
                    t("を"),
                    t("借りました", "かりました"),
                    t("。"),
                ),
                english = "I borrowed a new rain umbrella.",
                englishHighlight = "rain umbrella",
            ),
        ),
    )

    private fun person() = VocabWord(
        id = "hito",
        kanji = "人",
        hiragana = "ひと",
        romaji = "hito / jin",
        meaning = "PERSON",
        category = "People",
        sceneCaption = "See those two legs walking? That stick figure is a person. People walk on two feet!",
        sceneHighlightWords = listOf("person", "People"),
        mnemonicHook = "HITO looks like a walker",
        mnemonicBody = "人 looks like a person walking: one stroke is the left leg, the other is the right.",
        sceneTint = 0xFFD7A56A,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("あの"), t("人", "ひと", true), t("は"), t("先生", "せんせい"), t("です。")),
                english = "That person is a teacher.",
                englishHighlight = "person",
            ),
            ExampleSentence(
                tokens = listOf(t("日本人", "にほんじん", true), t("は"), t("優しい", "やさしい"), t("です。")),
                english = "Japanese people are kind.",
                englishHighlight = "Japanese people",
            ),
            ExampleSentence(
                tokens = listOf(t("三人", "さんにん", true), t("が"), t("来ます", "きます"), t("。")),
                english = "Three people will come.",
                englishHighlight = "people",
            ),
        ),
    )

    private fun sunDay() = VocabWord(
        id = "hi",
        kanji = "日",
        hiragana = "ひ",
        romaji = "hi / nichi",
        meaning = "SUN / DAY",
        category = "Time",
        sceneCaption = "A bright window of sunlight. One square of light is one day under the sun.",
        sceneHighlightWords = listOf("day", "sun"),
        mnemonicHook = "A window of sun",
        mnemonicBody = "日 is a window with a sunbeam through the middle. Each sunrise starts a new day.",
        sceneTint = 0xFFE8B84A,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("今日", "きょう", true), t("は"), t("日曜日", "にちようび"), t("です。")),
                english = "Today is Sunday.",
                englishHighlight = "Today",
            ),
            ExampleSentence(
                tokens = listOf(t("日本", "にほん", true), t("に"), t("行きます", "いきます"), t("。")),
                english = "I will go to Japan.",
                englishHighlight = "Japan",
            ),
            ExampleSentence(
                tokens = listOf(t("毎日", "まいにち", true), t("日本語", "にほんご"), t("を"), t("勉強します", "べんきょうします"), t("。")),
                english = "I study Japanese every day.",
                englishHighlight = "every day",
            ),
        ),
    )

    private fun water() = VocabWord(
        id = "mizu",
        kanji = "水",
        hiragana = "みず",
        romaji = "mizu / sui",
        meaning = "WATER",
        category = "Nature",
        sceneCaption = "Water splashes left and right from a stream. Keep a bottle of water with you!",
        sceneHighlightWords = listOf("Water", "water"),
        mnemonicHook = "MIZU sprays sideways",
        mnemonicBody = "The middle stroke is a stream. The side strokes are water spraying out. MIZU = water!",
        sceneTint = 0xFF6BA8D1,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("水", "みず", true), t("を"), t("ください。")),
                english = "Water, please.",
                englishHighlight = "Water",
            ),
            ExampleSentence(
                tokens = listOf(t("この"), t("水", "みず", true), t("は"), t("冷たい", "つめたい"), t("です。")),
                english = "This water is cold.",
                englishHighlight = "water",
            ),
            ExampleSentence(
                tokens = listOf(t("水曜日", "すいようび", true), t("に"), t("会いましょう", "あいましょう"), t("。")),
                english = "Let's meet on Wednesday.",
                englishHighlight = "Wednesday",
            ),
        ),
    )

    private fun fire() = VocabWord(
        id = "hi-fire",
        kanji = "火",
        hiragana = "ひ",
        romaji = "hi / ka",
        meaning = "FIRE",
        category = "Nature",
        sceneCaption = "A campfire with two person-like sparks dancing on the sides. Careful, it's fire!",
        sceneHighlightWords = listOf("fire"),
        mnemonicHook = "Person + sparks = fire",
        mnemonicBody = "火 looks like 人 (person) with extra flames on both sides. A person standing in fire.",
        sceneTint = 0xFFE07A3D,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("火", "ひ", true), t("に"), t("気をつけて", "きをつけて"), t("ください。")),
                english = "Please be careful with fire.",
                englishHighlight = "fire",
            ),
            ExampleSentence(
                tokens = listOf(t("火曜日", "かようび", true), t("は"), t("忙しい", "いそがしい"), t("です。")),
                english = "Tuesday is busy.",
                englishHighlight = "Tuesday",
            ),
            ExampleSentence(
                tokens = listOf(t("花火", "はなび", true), t("が"), t("きれいです。")),
                english = "The fireworks are beautiful.",
                englishHighlight = "fireworks",
            ),
        ),
    )

    private fun mountain() = VocabWord(
        id = "yama",
        kanji = "山",
        hiragana = "やま",
        romaji = "yama / san",
        meaning = "MOUNTAIN",
        category = "Nature",
        sceneCaption = "Three peaks on the horizon. The tallest one in the middle is the mountain.",
        sceneHighlightWords = listOf("mountain"),
        mnemonicHook = "Three mountain peaks",
        mnemonicBody = "山 is a picture of three peaks. The middle peak is the highest mountain.",
        sceneTint = 0xFF6B8F71,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("富士山", "ふじさん", true), t("は"), t("高い", "たかい"), t("です。")),
                english = "Mt. Fuji is tall.",
                englishHighlight = "Mt. Fuji",
            ),
            ExampleSentence(
                tokens = listOf(t("山", "やま", true), t("に"), t("行きます", "いきます"), t("。")),
                english = "I will go to the mountain.",
                englishHighlight = "mountain",
            ),
            ExampleSentence(
                tokens = listOf(t("山田", "やまだ", true), t("さんは"), t("学生", "がくせい"), t("です。")),
                english = "Yamada-san is a student.",
                englishHighlight = "Yamada",
            ),
        ),
    )

    private fun tree() = VocabWord(
        id = "ki",
        kanji = "木",
        hiragana = "き",
        romaji = "ki / moku",
        meaning = "TREE",
        category = "Nature",
        sceneCaption = "A trunk, branches, and roots. That is a tree standing in the park.",
        sceneHighlightWords = listOf("tree"),
        mnemonicHook = "Trunk + branches",
        mnemonicBody = "木 is a tree: the vertical line is the trunk, the top is branches, the bottom is roots.",
        sceneTint = 0xFF7A9E5A,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("あの"), t("木", "き", true), t("は"), t("大きい", "おおきい"), t("です。")),
                english = "That tree is big.",
                englishHighlight = "tree",
            ),
            ExampleSentence(
                tokens = listOf(t("木曜日", "もくようび", true), t("に"), t("会いましょう", "あいましょう"), t("。")),
                english = "Let's meet on Thursday.",
                englishHighlight = "Thursday",
            ),
            ExampleSentence(
                tokens = listOf(t("木材", "もくざい", true), t("で"), t("机", "つくえ"), t("を"), t("作ります", "つくります"), t("。")),
                english = "We make a desk from wood.",
                englishHighlight = "wood",
            ),
        ),
    )

    private fun book() = VocabWord(
        id = "hon",
        kanji = "本",
        hiragana = "ほん",
        romaji = "hon",
        meaning = "BOOK",
        category = "School",
        sceneCaption = "A tree with a root mark. From trees we make paper, and from paper we make a book.",
        sceneHighlightWords = listOf("book"),
        mnemonicHook = "Tree with a root = book",
        mnemonicBody = "本 is 木 (tree) with a extra root line. Books come from trees. HON = book.",
        sceneTint = 0xFFC4A574,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("この"), t("本", "ほん", true), t("は"), t("面白い", "おもしろい"), t("です。")),
                english = "This book is interesting.",
                englishHighlight = "book",
            ),
            ExampleSentence(
                tokens = listOf(t("日本語", "にほんご", true), t("の"), t("本", "ほん"), t("を"), t("読みます", "よみます"), t("。")),
                english = "I read a Japanese book.",
                englishHighlight = "Japanese",
            ),
            ExampleSentence(
                tokens = listOf(t("本屋", "ほんや", true), t("は"), t("あそこです。")),
                english = "The bookstore is over there.",
                englishHighlight = "bookstore",
            ),
        ),
    )

    private fun eat() = VocabWord(
        id = "taberu",
        kanji = "食",
        hiragana = "たべる",
        romaji = "tabe / shoku",
        meaning = "EAT",
        category = "Daily life",
        sceneCaption = "A lid over a bowl of good food. Time to eat!",
        sceneHighlightWords = listOf("eat"),
        mnemonicHook = "Lid on a good meal",
        mnemonicBody = "食 looks like a lid covering a bowl of food. When the lid comes off, you eat.",
        sceneTint = 0xFFD98B5F,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("ごはんを"), t("食べます", "たべます", true), t("。")),
                english = "I eat a meal.",
                englishHighlight = "eat",
            ),
            ExampleSentence(
                tokens = listOf(t("食堂", "しょくどう", true), t("は"), t("二階", "にかい"), t("です。")),
                english = "The cafeteria is on the second floor.",
                englishHighlight = "cafeteria",
            ),
            ExampleSentence(
                tokens = listOf(t("朝食", "ちょうしょく", true), t("を"), t("食べました", "たべました"), t("。")),
                english = "I ate breakfast.",
                englishHighlight = "breakfast",
            ),
        ),
    )

    private fun see() = VocabWord(
        id = "miru",
        kanji = "見",
        hiragana = "みる",
        romaji = "mi / ken",
        meaning = "SEE",
        category = "Daily life",
        sceneCaption = "An eye on two walking legs. The eye goes out to see the world.",
        sceneHighlightWords = listOf("see"),
        mnemonicHook = "An eye with legs",
        mnemonicBody = "見 is an eye sitting on two legs. The eye walks around so it can see everything.",
        sceneTint = 0xFF8AA6C1,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("テレビを"), t("見ます", "みます", true), t("。")),
                english = "I watch TV.",
                englishHighlight = "watch",
            ),
            ExampleSentence(
                tokens = listOf(t("富士山", "ふじさん"), t("が"), t("見えます", "みえます", true), t("。")),
                english = "I can see Mt. Fuji.",
                englishHighlight = "see",
            ),
            ExampleSentence(
                tokens = listOf(t("意見", "いけん", true), t("を"), t("聞いて", "きいて"), t("ください。")),
                english = "Please listen to my opinion.",
                englishHighlight = "opinion",
            ),
        ),
    )

    private fun go() = VocabWord(
        id = "iku",
        kanji = "行",
        hiragana = "いく",
        romaji = "i / kou",
        meaning = "GO",
        category = "Daily life",
        sceneCaption = "A crossroads. Pick a path and go!",
        sceneHighlightWords = listOf("go"),
        mnemonicHook = "A crossroads you go down",
        mnemonicBody = "行 looks like a crossing of roads. Step onto the path and go.",
        sceneTint = 0xFF6A9B8E,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("学校", "がっこう"), t("に"), t("行きます", "いきます", true), t("。")),
                english = "I go to school.",
                englishHighlight = "go",
            ),
            ExampleSentence(
                tokens = listOf(t("京都", "きょうと"), t("へ"), t("行きました", "いきました", true), t("。")),
                english = "I went to Kyoto.",
                englishHighlight = "went",
            ),
            ExampleSentence(
                tokens = listOf(t("銀行", "ぎんこう", true), t("は"), t("どこですか。")),
                english = "Where is the bank?",
                englishHighlight = "bank",
            ),
        ),
    )

    private fun big() = VocabWord(
        id = "ookii",
        kanji = "大",
        hiragana = "おおきい",
        romaji = "oo / dai",
        meaning = "BIG",
        category = "Adjectives",
        sceneCaption = "A person stretching both arms as wide as they can. That is big!",
        sceneHighlightWords = listOf("big"),
        mnemonicHook = "A person with arms wide",
        mnemonicBody = "大 is a person spreading both arms to show how big something is.",
        sceneTint = 0xFFC9785A,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("この"), t("犬", "いぬ"), t("は"), t("大きい", "おおきい", true), t("です。")),
                english = "This dog is big.",
                englishHighlight = "big",
            ),
            ExampleSentence(
                tokens = listOf(t("大学", "だいがく", true), t("で"), t("日本語", "にほんご"), t("を"), t("勉強します", "べんきょうします"), t("。")),
                english = "I study Japanese at university.",
                englishHighlight = "university",
            ),
            ExampleSentence(
                tokens = listOf(t("大好き", "だいすき", true), t("です。")),
                english = "I like it a lot.",
                englishHighlight = "a lot",
            ),
        ),
    )

    private fun small() = VocabWord(
        id = "chiisai",
        kanji = "小",
        hiragana = "ちいさい",
        romaji = "chii / shou",
        meaning = "SMALL",
        category = "Adjectives",
        sceneCaption = "A tiny hook with two little drops. Everything here is small.",
        sceneHighlightWords = listOf("small"),
        mnemonicHook = "A tiny hook",
        mnemonicBody = "小 is a small hook with two tiny ticks. It looks smaller than 大 on purpose.",
        sceneTint = 0xFFB7C97A,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("小さい", "ちいさい", true), t("猫", "ねこ"), t("です。")),
                english = "It is a small cat.",
                englishHighlight = "small",
            ),
            ExampleSentence(
                tokens = listOf(t("小学校", "しょうがっこう", true), t("は"), t("近い", "ちかい"), t("です。")),
                english = "The elementary school is nearby.",
                englishHighlight = "elementary school",
            ),
            ExampleSentence(
                tokens = listOf(t("小声", "こごえ", true), t("で"), t("話して", "はなして"), t("ください。")),
                english = "Please speak in a small voice.",
                englishHighlight = "small voice",
            ),
        ),
    )

    private fun schoolLearn() = VocabWord(
        id = "manabu",
        kanji = "学",
        hiragana = "まなぶ",
        romaji = "mana / gaku",
        meaning = "LEARN / STUDY",
        category = "School",
        sceneCaption = "A child under a roof, studying. School is where we learn.",
        sceneHighlightWords = listOf("learn", "School"),
        mnemonicHook = "Child under a school roof",
        mnemonicBody = "学 shows a child (子) under a roof. That roof is school, where you learn.",
        sceneTint = 0xFF7E9CC2,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("日本語", "にほんご"), t("を"), t("学びます", "まなびます", true), t("。")),
                english = "I learn Japanese.",
                englishHighlight = "learn",
            ),
            ExampleSentence(
                tokens = listOf(t("学生", "がくせい", true), t("です。")),
                english = "I am a student.",
                englishHighlight = "student",
            ),
            ExampleSentence(
                tokens = listOf(t("学校", "がっこう", true), t("は"), t("楽しい", "たのしい"), t("です。")),
                english = "School is fun.",
                englishHighlight = "School",
            ),
        ),
    )

    private fun time() = VocabWord(
        id = "toki",
        kanji = "時",
        hiragana = "とき",
        romaji = "toki / ji",
        meaning = "TIME",
        category = "Time",
        sceneCaption = "The sun beside a temple. Temple bells used to tell the time.",
        sceneHighlightWords = listOf("time"),
        mnemonicHook = "Sun + temple bell",
        mnemonicBody = "時 is 日 (sun/day) plus a temple. Old temples rang bells to mark the time.",
        sceneTint = 0xFFC9A46B,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("今", "いま"), t("何時", "なんじ", true), t("ですか。")),
                english = "What time is it now?",
                englishHighlight = "time",
            ),
            ExampleSentence(
                tokens = listOf(t("三時", "さんじ", true), t("に"), t("会いましょう", "あいましょう"), t("。")),
                english = "Let's meet at 3 o'clock.",
                englishHighlight = "3 o'clock",
            ),
            ExampleSentence(
                tokens = listOf(t("時間", "じかん", true), t("が"), t("ありません。")),
                english = "I don't have time.",
                englishHighlight = "time",
            ),
        ),
    )

    private fun now() = VocabWord(
        id = "ima",
        kanji = "今",
        hiragana = "いま",
        romaji = "ima / kon",
        meaning = "NOW",
        category = "Time",
        sceneCaption = "A person under a roof, right this second. Not later — now!",
        sceneHighlightWords = listOf("now"),
        mnemonicHook = "This very moment",
        mnemonicBody = "今 looks like a person tucked under a cover, happening in this moment. IMA = now.",
        sceneTint = 0xFFD4A0A0,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("今", "いま", true), t("忙しい", "いそがしい"), t("です。")),
                english = "I am busy now.",
                englishHighlight = "now",
            ),
            ExampleSentence(
                tokens = listOf(t("今日", "きょう", true), t("は"), t("暑い", "あつい"), t("です。")),
                english = "It is hot today.",
                englishHighlight = "today",
            ),
            ExampleSentence(
                tokens = listOf(t("今晚", "こんばん", true), t("映画", "えいが"), t("を"), t("見ます", "みます"), t("。")),
                english = "I will watch a movie tonight.",
                englishHighlight = "tonight",
            ),
        ),
    )

    private fun friend() = VocabWord(
        id = "tomo",
        kanji = "友",
        hiragana = "とも",
        romaji = "tomo / yuu",
        meaning = "FRIEND",
        category = "People",
        sceneCaption = "Two hands reaching toward each other. That is a friend.",
        sceneHighlightWords = listOf("friend"),
        mnemonicHook = "Hands reaching out",
        mnemonicBody = "友 looks like two hands meeting. Friends reach out to each other. TOMO = friend.",
        sceneTint = 0xFFE09AA0,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("彼女", "かのじょ"), t("は"), t("友達", "ともだち", true), t("です。")),
                english = "She is my friend.",
                englishHighlight = "friend",
            ),
            ExampleSentence(
                tokens = listOf(t("友達", "ともだち", true), t("と"), t("遊びます", "あそびます"), t("。")),
                english = "I hang out with friends.",
                englishHighlight = "friends",
            ),
            ExampleSentence(
                tokens = listOf(t("友好", "ゆうこう", true), t("な"), t("人", "ひと"), t("です。")),
                english = "That person is friendly.",
                englishHighlight = "friendly",
            ),
        ),
    )

    private fun car() = VocabWord(
        id = "kuruma",
        kanji = "車",
        hiragana = "くるま",
        romaji = "kuruma / sha",
        meaning = "CAR",
        category = "Daily life",
        sceneCaption = "A top-down view of a chariot with two wheels. Today it means a car.",
        sceneHighlightWords = listOf("car"),
        mnemonicHook = "Wheels of a chariot",
        mnemonicBody = "車 is an old chariot seen from above, with wheels. Now it means car. KURUMA = car.",
        sceneTint = 0xFF8B9BB4,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("車", "くるま", true), t("で"), t("行きます", "いきます"), t("。")),
                english = "I will go by car.",
                englishHighlight = "car",
            ),
            ExampleSentence(
                tokens = listOf(t("電車", "でんしゃ", true), t("は"), t("便利", "べんり"), t("です。")),
                english = "The train is convenient.",
                englishHighlight = "train",
            ),
            ExampleSentence(
                tokens = listOf(t("自転車", "じてんしゃ", true), t("が"), t("あります。")),
                english = "I have a bicycle.",
                englishHighlight = "bicycle",
            ),
        ),
    )

    private fun newWord() = VocabWord(
        id = "atarashii",
        kanji = "新",
        hiragana = "あたらしい",
        romaji = "atara / shin",
        meaning = "NEW",
        category = "Adjectives",
        sceneCaption = "Fresh-cut wood standing by an axe. Something newly made.",
        sceneHighlightWords = listOf("new"),
        mnemonicHook = "Freshly cut wood",
        mnemonicBody = "新 has an axe beside a stand of wood. Freshly cut wood is new.",
        sceneTint = 0xFF8FBF88,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("新しい", "あたらしい", true), t("本", "ほん"), t("です。")),
                english = "It is a new book.",
                englishHighlight = "new",
            ),
            ExampleSentence(
                tokens = listOf(t("新聞", "しんぶん", true), t("を"), t("読みます", "よみます"), t("。")),
                english = "I read the newspaper.",
                englishHighlight = "newspaper",
            ),
            ExampleSentence(
                tokens = listOf(t("新年", "しんねん", true), t("おめでとう。")),
                english = "Happy New Year.",
                englishHighlight = "New Year",
            ),
        ),
    )

    private fun buy() = VocabWord(
        id = "kau",
        kanji = "買",
        hiragana = "かう",
        romaji = "ka / bai",
        meaning = "BUY",
        category = "Daily life",
        sceneCaption = "A shopping basket (eye-like net) over a shelf of goods. Time to buy something!",
        sceneHighlightWords = listOf("buy"),
        mnemonicHook = "A net over money goods",
        mnemonicBody = "買 looks like a net or basket over shells (old money). You scoop up goods when you buy.",
        sceneTint = 0xFFD4B06A,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("パンを"), t("買います", "かいます", true), t("。")),
                english = "I buy bread.",
                englishHighlight = "buy",
            ),
            ExampleSentence(
                tokens = listOf(t("買い物", "かいもの", true), t("に"), t("行きます", "いきます"), t("。")),
                english = "I go shopping.",
                englishHighlight = "shopping",
            ),
            ExampleSentence(
                tokens = listOf(t("高い", "たかい"), t("靴", "くつ"), t("を"), t("買いました", "かいました", true), t("。")),
                english = "I bought expensive shoes.",
                englishHighlight = "bought",
            ),
        ),
    )

    private fun drink() = VocabWord(
        id = "nomu",
        kanji = "飲",
        hiragana = "のむ",
        romaji = "no / in",
        meaning = "DRINK",
        category = "Daily life",
        sceneCaption = "Food on the left, a yawning mouth on the right. Open up and drink!",
        sceneHighlightWords = listOf("drink"),
        mnemonicHook = "Food + open mouth",
        mnemonicBody = "飲 pairs 食 (food) with a person opening their mouth. That is drink.",
        sceneTint = 0xFF6FA8B8,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("水", "みず"), t("を"), t("飲みます", "のみます", true), t("。")),
                english = "I drink water.",
                englishHighlight = "drink",
            ),
            ExampleSentence(
                tokens = listOf(t("お茶", "おちゃ"), t("を"), t("飲みましょう", "のみましょう", true), t("。")),
                english = "Let's drink tea.",
                englishHighlight = "drink",
            ),
            ExampleSentence(
                tokens = listOf(t("飲み物", "のみもの", true), t("は"), t("何", "なに"), t("が"), t("いいですか。")),
                english = "What drink would you like?",
                englishHighlight = "drink",
            ),
        ),
    )

    private fun cheap() = VocabWord(
        id = "yasui",
        kanji = "安",
        hiragana = "やすい",
        romaji = "yasu / an",
        meaning = "CHEAP / SAFE",
        category = "Adjectives",
        sceneCaption = "A woman under a roof, at ease. When you feel safe, prices also feel cheap.",
        sceneHighlightWords = listOf("cheap", "safe"),
        mnemonicHook = "Woman at home, at ease",
        mnemonicBody = "安 is a woman under a roof. Home feels safe — and YASUI also means cheap.",
        sceneTint = 0xFFB6C98A,
        examples = listOf(
            ExampleSentence(
                tokens = listOf(t("この"), t("時計", "とけい"), t("は"), t("安い", "やすい", true), t("です。")),
                english = "This watch is cheap.",
                englishHighlight = "cheap",
            ),
            ExampleSentence(
                tokens = listOf(t("安心", "あんしん", true), t("してください。")),
                english = "Please don't worry.",
                englishHighlight = "don't worry",
            ),
            ExampleSentence(
                tokens = listOf(t("安全", "あんぜん", true), t("な"), t("所", "ところ"), t("です。")),
                english = "It is a safe place.",
                englishHighlight = "safe",
            ),
        ),
    )
}
