export type RubyToken = {
  text: string;
  reading: string | null;
  highlight: boolean;
};

export type ExampleSentence = {
  tokens: RubyToken[];
  english: string;
  englishHighlight: string;
};

export type VocabWord = {
  id: string;
  kanji: string;
  hiragana: string;
  romaji: string;
  meaning: string;
  category: string;
  sceneCaption: string;
  sceneHighlightWords: string[];
  mnemonicHook: string;
  mnemonicBody: string;
  sceneTint: string;
  examples: ExampleSentence[];
  sceneImage: string;
  fullCard?: boolean;
  /** Which Learn filter this card belongs to. */
  deck?: "starter" | "n5" | "pdf";
};

export const words: VocabWord[] = [
  {
    "id": "ame",
    "sceneImage": "/scenes/ame.png",
    "kanji": "雨",
    "hiragana": "あめ",
    "romaji": "ame / u",
    "meaning": "RAIN",
    "category": "Nature",
    "sceneCaption": "Look! There is rain everywhere. It's a real downpour! We must use our rain umbrella.",
    "sceneHighlightWords": [
      "rain",
      "umbrella"
    ],
    "mnemonicHook": "AME = A-ME-lla",
    "mnemonicBody": "Remember: AME = A-ME-lla (rhymes with Umbrella). When it rains, you need an umbrella!",
    "sceneTint": "#7ba7c9",
    "examples": [
      {
        "tokens": [
          {
            "text": "日本",
            "reading": "にほん",
            "highlight": false
          },
          {
            "text": "の",
            "reading": null,
            "highlight": false
          },
          {
            "text": "梅雨",
            "reading": "つゆ",
            "highlight": true
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "長い",
            "reading": "ながい",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "The rainy season in Japan is long.",
        "englishHighlight": "rainy season"
      },
      {
        "tokens": [
          {
            "text": "外",
            "reading": "そと",
            "highlight": false
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "小雨",
            "reading": "こさめ",
            "highlight": true
          },
          {
            "text": "が",
            "reading": null,
            "highlight": false
          },
          {
            "text": "降っています",
            "reading": "ふっています",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "It is drizzling outside.",
        "englishHighlight": "drizzling"
      },
      {
        "tokens": [
          {
            "text": "私",
            "reading": "わたし",
            "highlight": false
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "新しい",
            "reading": "あたらしい",
            "highlight": false
          },
          {
            "text": "雨傘",
            "reading": "あまがさ",
            "highlight": true
          },
          {
            "text": "を",
            "reading": null,
            "highlight": false
          },
          {
            "text": "借りました",
            "reading": "かりました",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I borrowed a new rain umbrella.",
        "englishHighlight": "rain umbrella"
      }
    ]
  },
  {
    "id": "hito",
    "sceneImage": "/scenes/hito.png",
    "kanji": "人",
    "hiragana": "ひと",
    "romaji": "hito / jin",
    "meaning": "PERSON",
    "category": "People",
    "sceneCaption": "See those two legs walking? That stick figure is a person. People walk on two feet!",
    "sceneHighlightWords": [
      "person",
      "People"
    ],
    "mnemonicHook": "HITO looks like a walker",
    "mnemonicBody": "人 looks like a person walking: one stroke is the left leg, the other is the right.",
    "sceneTint": "#d7a56a",
    "examples": [
      {
        "tokens": [
          {
            "text": "あの",
            "reading": null,
            "highlight": false
          },
          {
            "text": "人",
            "reading": "ひと",
            "highlight": true
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "先生",
            "reading": "せんせい",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "That person is a teacher.",
        "englishHighlight": "person"
      },
      {
        "tokens": [
          {
            "text": "日本人",
            "reading": "にほんじん",
            "highlight": true
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "優しい",
            "reading": "やさしい",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "Japanese people are kind.",
        "englishHighlight": "Japanese people"
      },
      {
        "tokens": [
          {
            "text": "三人",
            "reading": "さんにん",
            "highlight": true
          },
          {
            "text": "が",
            "reading": null,
            "highlight": false
          },
          {
            "text": "来ます",
            "reading": "きます",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "Three people will come.",
        "englishHighlight": "people"
      }
    ]
  },
  {
    "id": "hi",
    "sceneImage": "/scenes/hi.png",
    "kanji": "日",
    "hiragana": "ひ",
    "romaji": "hi / nichi",
    "meaning": "SUN / DAY",
    "category": "Time",
    "sceneCaption": "A bright window of sunlight. One square of light is one day under the sun.",
    "sceneHighlightWords": [
      "day",
      "sun"
    ],
    "mnemonicHook": "A window of sun",
    "mnemonicBody": "日 is a window with a sunbeam through the middle. Each sunrise starts a new day.",
    "sceneTint": "#e8b84a",
    "examples": [
      {
        "tokens": [
          {
            "text": "今日",
            "reading": "きょう",
            "highlight": true
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "日曜日",
            "reading": "にちようび",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "Today is Sunday.",
        "englishHighlight": "Today"
      },
      {
        "tokens": [
          {
            "text": "日本",
            "reading": "にほん",
            "highlight": true
          },
          {
            "text": "に",
            "reading": null,
            "highlight": false
          },
          {
            "text": "行きます",
            "reading": "いきます",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I will go to Japan.",
        "englishHighlight": "Japan"
      },
      {
        "tokens": [
          {
            "text": "毎日",
            "reading": "まいにち",
            "highlight": true
          },
          {
            "text": "日本語",
            "reading": "にほんご",
            "highlight": false
          },
          {
            "text": "を",
            "reading": null,
            "highlight": false
          },
          {
            "text": "勉強します",
            "reading": "べんきょうします",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I study Japanese every day.",
        "englishHighlight": "every day"
      }
    ]
  },
  {
    "id": "mizu",
    "sceneImage": "/scenes/mizu.png",
    "kanji": "水",
    "hiragana": "みず",
    "romaji": "mizu / sui",
    "meaning": "WATER",
    "category": "Nature",
    "sceneCaption": "Water splashes left and right from a stream. Keep a bottle of water with you!",
    "sceneHighlightWords": [
      "Water",
      "water"
    ],
    "mnemonicHook": "MIZU sprays sideways",
    "mnemonicBody": "The middle stroke is a stream. The side strokes are water spraying out. MIZU = water!",
    "sceneTint": "#6ba8d1",
    "examples": [
      {
        "tokens": [
          {
            "text": "水",
            "reading": "みず",
            "highlight": true
          },
          {
            "text": "を",
            "reading": null,
            "highlight": false
          },
          {
            "text": "ください。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "Water, please.",
        "englishHighlight": "Water"
      },
      {
        "tokens": [
          {
            "text": "この",
            "reading": null,
            "highlight": false
          },
          {
            "text": "水",
            "reading": "みず",
            "highlight": true
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "冷たい",
            "reading": "つめたい",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "This water is cold.",
        "englishHighlight": "water"
      },
      {
        "tokens": [
          {
            "text": "水曜日",
            "reading": "すいようび",
            "highlight": true
          },
          {
            "text": "に",
            "reading": null,
            "highlight": false
          },
          {
            "text": "会いましょう",
            "reading": "あいましょう",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "Let's meet on Wednesday.",
        "englishHighlight": "Wednesday"
      }
    ]
  },
  {
    "id": "hi-fire",
    "sceneImage": "/scenes/hi-fire.png",
    "kanji": "火",
    "hiragana": "ひ",
    "romaji": "hi / ka",
    "meaning": "FIRE",
    "category": "Nature",
    "sceneCaption": "A campfire with two person-like sparks dancing on the sides. Careful, it's fire!",
    "sceneHighlightWords": [
      "fire"
    ],
    "mnemonicHook": "Person + sparks = fire",
    "mnemonicBody": "火 looks like 人 (person) with extra flames on both sides. A person standing in fire.",
    "sceneTint": "#e07a3d",
    "examples": [
      {
        "tokens": [
          {
            "text": "火",
            "reading": "ひ",
            "highlight": true
          },
          {
            "text": "に",
            "reading": null,
            "highlight": false
          },
          {
            "text": "気をつけて",
            "reading": "きをつけて",
            "highlight": false
          },
          {
            "text": "ください。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "Please be careful with fire.",
        "englishHighlight": "fire"
      },
      {
        "tokens": [
          {
            "text": "火曜日",
            "reading": "かようび",
            "highlight": true
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "忙しい",
            "reading": "いそがしい",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "Tuesday is busy.",
        "englishHighlight": "Tuesday"
      },
      {
        "tokens": [
          {
            "text": "花火",
            "reading": "はなび",
            "highlight": true
          },
          {
            "text": "が",
            "reading": null,
            "highlight": false
          },
          {
            "text": "きれいです。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "The fireworks are beautiful.",
        "englishHighlight": "fireworks"
      }
    ]
  },
  {
    "id": "yama",
    "sceneImage": "/scenes/yama.png",
    "kanji": "山",
    "hiragana": "やま",
    "romaji": "yama / san",
    "meaning": "MOUNTAIN",
    "category": "Nature",
    "sceneCaption": "Three peaks on the horizon. The tallest one in the middle is the mountain.",
    "sceneHighlightWords": [
      "mountain"
    ],
    "mnemonicHook": "Three mountain peaks",
    "mnemonicBody": "山 is a picture of three peaks. The middle peak is the highest mountain.",
    "sceneTint": "#6b8f71",
    "examples": [
      {
        "tokens": [
          {
            "text": "富士山",
            "reading": "ふじさん",
            "highlight": true
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "高い",
            "reading": "たかい",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "Mt. Fuji is tall.",
        "englishHighlight": "Mt. Fuji"
      },
      {
        "tokens": [
          {
            "text": "山",
            "reading": "やま",
            "highlight": true
          },
          {
            "text": "に",
            "reading": null,
            "highlight": false
          },
          {
            "text": "行きます",
            "reading": "いきます",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I will go to the mountain.",
        "englishHighlight": "mountain"
      },
      {
        "tokens": [
          {
            "text": "山田",
            "reading": "やまだ",
            "highlight": true
          },
          {
            "text": "さんは",
            "reading": null,
            "highlight": false
          },
          {
            "text": "学生",
            "reading": "がくせい",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "Yamada-san is a student.",
        "englishHighlight": "Yamada"
      }
    ]
  },
  {
    "id": "ki",
    "sceneImage": "/scenes/ki.png",
    "kanji": "木",
    "hiragana": "き",
    "romaji": "ki / moku",
    "meaning": "TREE",
    "category": "Nature",
    "sceneCaption": "A trunk, branches, and roots. That is a tree standing in the park.",
    "sceneHighlightWords": [
      "tree"
    ],
    "mnemonicHook": "Trunk + branches",
    "mnemonicBody": "木 is a tree: the vertical line is the trunk, the top is branches, the bottom is roots.",
    "sceneTint": "#7a9e5a",
    "examples": [
      {
        "tokens": [
          {
            "text": "あの",
            "reading": null,
            "highlight": false
          },
          {
            "text": "木",
            "reading": "き",
            "highlight": true
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "大きい",
            "reading": "おおきい",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "That tree is big.",
        "englishHighlight": "tree"
      },
      {
        "tokens": [
          {
            "text": "木曜日",
            "reading": "もくようび",
            "highlight": true
          },
          {
            "text": "に",
            "reading": null,
            "highlight": false
          },
          {
            "text": "会いましょう",
            "reading": "あいましょう",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "Let's meet on Thursday.",
        "englishHighlight": "Thursday"
      },
      {
        "tokens": [
          {
            "text": "木材",
            "reading": "もくざい",
            "highlight": true
          },
          {
            "text": "で",
            "reading": null,
            "highlight": false
          },
          {
            "text": "机",
            "reading": "つくえ",
            "highlight": false
          },
          {
            "text": "を",
            "reading": null,
            "highlight": false
          },
          {
            "text": "作ります",
            "reading": "つくります",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "We make a desk from wood.",
        "englishHighlight": "wood"
      }
    ]
  },
  {
    "id": "hon",
    "sceneImage": "/scenes/hon.png",
    "kanji": "本",
    "hiragana": "ほん",
    "romaji": "hon",
    "meaning": "BOOK",
    "category": "School",
    "sceneCaption": "A tree with a root mark. From trees we make paper, and from paper we make a book.",
    "sceneHighlightWords": [
      "book"
    ],
    "mnemonicHook": "Tree with a root = book",
    "mnemonicBody": "本 is 木 (tree) with a extra root line. Books come from trees. HON = book.",
    "sceneTint": "#c4a574",
    "examples": [
      {
        "tokens": [
          {
            "text": "この",
            "reading": null,
            "highlight": false
          },
          {
            "text": "本",
            "reading": "ほん",
            "highlight": true
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "面白い",
            "reading": "おもしろい",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "This book is interesting.",
        "englishHighlight": "book"
      },
      {
        "tokens": [
          {
            "text": "日本語",
            "reading": "にほんご",
            "highlight": true
          },
          {
            "text": "の",
            "reading": null,
            "highlight": false
          },
          {
            "text": "本",
            "reading": "ほん",
            "highlight": false
          },
          {
            "text": "を",
            "reading": null,
            "highlight": false
          },
          {
            "text": "読みます",
            "reading": "よみます",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I read a Japanese book.",
        "englishHighlight": "Japanese"
      },
      {
        "tokens": [
          {
            "text": "本屋",
            "reading": "ほんや",
            "highlight": true
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "あそこです。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "The bookstore is over there.",
        "englishHighlight": "bookstore"
      }
    ]
  },
  {
    "id": "taberu",
    "sceneImage": "/scenes/taberu.png",
    "kanji": "食",
    "hiragana": "たべる",
    "romaji": "tabe / shoku",
    "meaning": "EAT",
    "category": "Daily life",
    "sceneCaption": "A lid over a bowl of good food. Time to eat!",
    "sceneHighlightWords": [
      "eat"
    ],
    "mnemonicHook": "Lid on a good meal",
    "mnemonicBody": "食 looks like a lid covering a bowl of food. When the lid comes off, you eat.",
    "sceneTint": "#d98b5f",
    "examples": [
      {
        "tokens": [
          {
            "text": "ごはんを",
            "reading": null,
            "highlight": false
          },
          {
            "text": "食べます",
            "reading": "たべます",
            "highlight": true
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I eat a meal.",
        "englishHighlight": "eat"
      },
      {
        "tokens": [
          {
            "text": "食堂",
            "reading": "しょくどう",
            "highlight": true
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "二階",
            "reading": "にかい",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "The cafeteria is on the second floor.",
        "englishHighlight": "cafeteria"
      },
      {
        "tokens": [
          {
            "text": "朝食",
            "reading": "ちょうしょく",
            "highlight": true
          },
          {
            "text": "を",
            "reading": null,
            "highlight": false
          },
          {
            "text": "食べました",
            "reading": "たべました",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I ate breakfast.",
        "englishHighlight": "breakfast"
      }
    ]
  },
  {
    "id": "miru",
    "sceneImage": "/scenes/miru.png",
    "kanji": "見",
    "hiragana": "みる",
    "romaji": "mi / ken",
    "meaning": "SEE",
    "category": "Daily life",
    "sceneCaption": "An eye on two walking legs. The eye goes out to see the world.",
    "sceneHighlightWords": [
      "see"
    ],
    "mnemonicHook": "An eye with legs",
    "mnemonicBody": "見 is an eye sitting on two legs. The eye walks around so it can see everything.",
    "sceneTint": "#8aa6c1",
    "examples": [
      {
        "tokens": [
          {
            "text": "テレビを",
            "reading": null,
            "highlight": false
          },
          {
            "text": "見ます",
            "reading": "みます",
            "highlight": true
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I watch TV.",
        "englishHighlight": "watch"
      },
      {
        "tokens": [
          {
            "text": "富士山",
            "reading": "ふじさん",
            "highlight": false
          },
          {
            "text": "が",
            "reading": null,
            "highlight": false
          },
          {
            "text": "見えます",
            "reading": "みえます",
            "highlight": true
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I can see Mt. Fuji.",
        "englishHighlight": "see"
      },
      {
        "tokens": [
          {
            "text": "意見",
            "reading": "いけん",
            "highlight": true
          },
          {
            "text": "を",
            "reading": null,
            "highlight": false
          },
          {
            "text": "聞いて",
            "reading": "きいて",
            "highlight": false
          },
          {
            "text": "ください。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "Please listen to my opinion.",
        "englishHighlight": "opinion"
      }
    ]
  },
  {
    "id": "iku",
    "sceneImage": "/scenes/iku.png",
    "kanji": "行",
    "hiragana": "いく",
    "romaji": "i / kou",
    "meaning": "GO",
    "category": "Daily life",
    "sceneCaption": "A crossroads. Pick a path and go!",
    "sceneHighlightWords": [
      "go"
    ],
    "mnemonicHook": "A crossroads you go down",
    "mnemonicBody": "行 looks like a crossing of roads. Step onto the path and go.",
    "sceneTint": "#6a9b8e",
    "examples": [
      {
        "tokens": [
          {
            "text": "学校",
            "reading": "がっこう",
            "highlight": false
          },
          {
            "text": "に",
            "reading": null,
            "highlight": false
          },
          {
            "text": "行きます",
            "reading": "いきます",
            "highlight": true
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I go to school.",
        "englishHighlight": "go"
      },
      {
        "tokens": [
          {
            "text": "京都",
            "reading": "きょうと",
            "highlight": false
          },
          {
            "text": "へ",
            "reading": null,
            "highlight": false
          },
          {
            "text": "行きました",
            "reading": "いきました",
            "highlight": true
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I went to Kyoto.",
        "englishHighlight": "went"
      },
      {
        "tokens": [
          {
            "text": "銀行",
            "reading": "ぎんこう",
            "highlight": true
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "どこですか。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "Where is the bank?",
        "englishHighlight": "bank"
      }
    ]
  },
  {
    "id": "ookii",
    "sceneImage": "/scenes/ookii.png",
    "kanji": "大",
    "hiragana": "おおきい",
    "romaji": "oo / dai",
    "meaning": "BIG",
    "category": "Adjectives",
    "sceneCaption": "A person stretching both arms as wide as they can. That is big!",
    "sceneHighlightWords": [
      "big"
    ],
    "mnemonicHook": "A person with arms wide",
    "mnemonicBody": "大 is a person spreading both arms to show how big something is.",
    "sceneTint": "#c9785a",
    "examples": [
      {
        "tokens": [
          {
            "text": "この",
            "reading": null,
            "highlight": false
          },
          {
            "text": "犬",
            "reading": "いぬ",
            "highlight": false
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "大きい",
            "reading": "おおきい",
            "highlight": true
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "This dog is big.",
        "englishHighlight": "big"
      },
      {
        "tokens": [
          {
            "text": "大学",
            "reading": "だいがく",
            "highlight": true
          },
          {
            "text": "で",
            "reading": null,
            "highlight": false
          },
          {
            "text": "日本語",
            "reading": "にほんご",
            "highlight": false
          },
          {
            "text": "を",
            "reading": null,
            "highlight": false
          },
          {
            "text": "勉強します",
            "reading": "べんきょうします",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I study Japanese at university.",
        "englishHighlight": "university"
      },
      {
        "tokens": [
          {
            "text": "大好き",
            "reading": "だいすき",
            "highlight": true
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I like it a lot.",
        "englishHighlight": "a lot"
      }
    ]
  },
  {
    "id": "chiisai",
    "sceneImage": "/scenes/chiisai.png",
    "kanji": "小",
    "hiragana": "ちいさい",
    "romaji": "chii / shou",
    "meaning": "SMALL",
    "category": "Adjectives",
    "sceneCaption": "A tiny hook with two little drops. Everything here is small.",
    "sceneHighlightWords": [
      "small"
    ],
    "mnemonicHook": "A tiny hook",
    "mnemonicBody": "小 is a small hook with two tiny ticks. It looks smaller than 大 on purpose.",
    "sceneTint": "#b7c97a",
    "examples": [
      {
        "tokens": [
          {
            "text": "小さい",
            "reading": "ちいさい",
            "highlight": true
          },
          {
            "text": "猫",
            "reading": "ねこ",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "It is a small cat.",
        "englishHighlight": "small"
      },
      {
        "tokens": [
          {
            "text": "小学校",
            "reading": "しょうがっこう",
            "highlight": true
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "近い",
            "reading": "ちかい",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "The elementary school is nearby.",
        "englishHighlight": "elementary school"
      },
      {
        "tokens": [
          {
            "text": "小声",
            "reading": "こごえ",
            "highlight": true
          },
          {
            "text": "で",
            "reading": null,
            "highlight": false
          },
          {
            "text": "話して",
            "reading": "はなして",
            "highlight": false
          },
          {
            "text": "ください。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "Please speak in a small voice.",
        "englishHighlight": "small voice"
      }
    ]
  },
  {
    "id": "manabu",
    "sceneImage": "/scenes/manabu.png",
    "kanji": "学",
    "hiragana": "まなぶ",
    "romaji": "mana / gaku",
    "meaning": "LEARN / STUDY",
    "category": "School",
    "sceneCaption": "A child under a roof, studying. School is where we learn.",
    "sceneHighlightWords": [
      "learn",
      "School"
    ],
    "mnemonicHook": "Child under a school roof",
    "mnemonicBody": "学 shows a child (子) under a roof. That roof is school, where you learn.",
    "sceneTint": "#7e9cc2",
    "examples": [
      {
        "tokens": [
          {
            "text": "日本語",
            "reading": "にほんご",
            "highlight": false
          },
          {
            "text": "を",
            "reading": null,
            "highlight": false
          },
          {
            "text": "学びます",
            "reading": "まなびます",
            "highlight": true
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I learn Japanese.",
        "englishHighlight": "learn"
      },
      {
        "tokens": [
          {
            "text": "学生",
            "reading": "がくせい",
            "highlight": true
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I am a student.",
        "englishHighlight": "student"
      },
      {
        "tokens": [
          {
            "text": "学校",
            "reading": "がっこう",
            "highlight": true
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "楽しい",
            "reading": "たのしい",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "School is fun.",
        "englishHighlight": "School"
      }
    ]
  },
  {
    "id": "toki",
    "sceneImage": "/scenes/toki.png",
    "kanji": "時",
    "hiragana": "とき",
    "romaji": "toki / ji",
    "meaning": "TIME",
    "category": "Time",
    "sceneCaption": "The sun beside a temple. Temple bells used to tell the time.",
    "sceneHighlightWords": [
      "time"
    ],
    "mnemonicHook": "Sun + temple bell",
    "mnemonicBody": "時 is 日 (sun/day) plus a temple. Old temples rang bells to mark the time.",
    "sceneTint": "#c9a46b",
    "examples": [
      {
        "tokens": [
          {
            "text": "今",
            "reading": "いま",
            "highlight": false
          },
          {
            "text": "何時",
            "reading": "なんじ",
            "highlight": true
          },
          {
            "text": "ですか。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "What time is it now?",
        "englishHighlight": "time"
      },
      {
        "tokens": [
          {
            "text": "三時",
            "reading": "さんじ",
            "highlight": true
          },
          {
            "text": "に",
            "reading": null,
            "highlight": false
          },
          {
            "text": "会いましょう",
            "reading": "あいましょう",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "Let's meet at 3 o'clock.",
        "englishHighlight": "3 o'clock"
      },
      {
        "tokens": [
          {
            "text": "時間",
            "reading": "じかん",
            "highlight": true
          },
          {
            "text": "が",
            "reading": null,
            "highlight": false
          },
          {
            "text": "ありません。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I don't have time.",
        "englishHighlight": "time"
      }
    ]
  },
  {
    "id": "ima",
    "sceneImage": "/scenes/ima.png",
    "kanji": "今",
    "hiragana": "いま",
    "romaji": "ima / kon",
    "meaning": "NOW",
    "category": "Time",
    "sceneCaption": "A person under a roof, right this second. Not later — now!",
    "sceneHighlightWords": [
      "now"
    ],
    "mnemonicHook": "This very moment",
    "mnemonicBody": "今 looks like a person tucked under a cover, happening in this moment. IMA = now.",
    "sceneTint": "#d4a0a0",
    "examples": [
      {
        "tokens": [
          {
            "text": "今",
            "reading": "いま",
            "highlight": true
          },
          {
            "text": "忙しい",
            "reading": "いそがしい",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I am busy now.",
        "englishHighlight": "now"
      },
      {
        "tokens": [
          {
            "text": "今日",
            "reading": "きょう",
            "highlight": true
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "暑い",
            "reading": "あつい",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "It is hot today.",
        "englishHighlight": "today"
      },
      {
        "tokens": [
          {
            "text": "今晚",
            "reading": "こんばん",
            "highlight": true
          },
          {
            "text": "映画",
            "reading": "えいが",
            "highlight": false
          },
          {
            "text": "を",
            "reading": null,
            "highlight": false
          },
          {
            "text": "見ます",
            "reading": "みます",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I will watch a movie tonight.",
        "englishHighlight": "tonight"
      }
    ]
  },
  {
    "id": "tomo",
    "sceneImage": "/scenes/tomo.png",
    "kanji": "友",
    "hiragana": "とも",
    "romaji": "tomo / yuu",
    "meaning": "FRIEND",
    "category": "People",
    "sceneCaption": "Two hands reaching toward each other. That is a friend.",
    "sceneHighlightWords": [
      "friend"
    ],
    "mnemonicHook": "Hands reaching out",
    "mnemonicBody": "友 looks like two hands meeting. Friends reach out to each other. TOMO = friend.",
    "sceneTint": "#e09aa0",
    "examples": [
      {
        "tokens": [
          {
            "text": "彼女",
            "reading": "かのじょ",
            "highlight": false
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "友達",
            "reading": "ともだち",
            "highlight": true
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "She is my friend.",
        "englishHighlight": "friend"
      },
      {
        "tokens": [
          {
            "text": "友達",
            "reading": "ともだち",
            "highlight": true
          },
          {
            "text": "と",
            "reading": null,
            "highlight": false
          },
          {
            "text": "遊びます",
            "reading": "あそびます",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I hang out with friends.",
        "englishHighlight": "friends"
      },
      {
        "tokens": [
          {
            "text": "友好",
            "reading": "ゆうこう",
            "highlight": true
          },
          {
            "text": "な",
            "reading": null,
            "highlight": false
          },
          {
            "text": "人",
            "reading": "ひと",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "That person is friendly.",
        "englishHighlight": "friendly"
      }
    ]
  },
  {
    "id": "kuruma",
    "sceneImage": "/scenes/kuruma.png",
    "kanji": "車",
    "hiragana": "くるま",
    "romaji": "kuruma / sha",
    "meaning": "CAR",
    "category": "Daily life",
    "sceneCaption": "A top-down view of a chariot with two wheels. Today it means a car.",
    "sceneHighlightWords": [
      "car"
    ],
    "mnemonicHook": "Wheels of a chariot",
    "mnemonicBody": "車 is an old chariot seen from above, with wheels. Now it means car. KURUMA = car.",
    "sceneTint": "#8b9bb4",
    "examples": [
      {
        "tokens": [
          {
            "text": "車",
            "reading": "くるま",
            "highlight": true
          },
          {
            "text": "で",
            "reading": null,
            "highlight": false
          },
          {
            "text": "行きます",
            "reading": "いきます",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I will go by car.",
        "englishHighlight": "car"
      },
      {
        "tokens": [
          {
            "text": "電車",
            "reading": "でんしゃ",
            "highlight": true
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "便利",
            "reading": "べんり",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "The train is convenient.",
        "englishHighlight": "train"
      },
      {
        "tokens": [
          {
            "text": "自転車",
            "reading": "じてんしゃ",
            "highlight": true
          },
          {
            "text": "が",
            "reading": null,
            "highlight": false
          },
          {
            "text": "あります。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I have a bicycle.",
        "englishHighlight": "bicycle"
      }
    ]
  },
  {
    "id": "atarashii",
    "sceneImage": "/scenes/atarashii.png",
    "kanji": "新",
    "hiragana": "あたらしい",
    "romaji": "atara / shin",
    "meaning": "NEW",
    "category": "Adjectives",
    "sceneCaption": "Fresh-cut wood standing by an axe. Something newly made.",
    "sceneHighlightWords": [
      "new"
    ],
    "mnemonicHook": "Freshly cut wood",
    "mnemonicBody": "新 has an axe beside a stand of wood. Freshly cut wood is new.",
    "sceneTint": "#8fbf88",
    "examples": [
      {
        "tokens": [
          {
            "text": "新しい",
            "reading": "あたらしい",
            "highlight": true
          },
          {
            "text": "本",
            "reading": "ほん",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "It is a new book.",
        "englishHighlight": "new"
      },
      {
        "tokens": [
          {
            "text": "新聞",
            "reading": "しんぶん",
            "highlight": true
          },
          {
            "text": "を",
            "reading": null,
            "highlight": false
          },
          {
            "text": "読みます",
            "reading": "よみます",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I read the newspaper.",
        "englishHighlight": "newspaper"
      },
      {
        "tokens": [
          {
            "text": "新年",
            "reading": "しんねん",
            "highlight": true
          },
          {
            "text": "おめでとう。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "Happy New Year.",
        "englishHighlight": "New Year"
      }
    ]
  },
  {
    "id": "kau",
    "sceneImage": "/scenes/kau.png",
    "kanji": "買",
    "hiragana": "かう",
    "romaji": "ka / bai",
    "meaning": "BUY",
    "category": "Daily life",
    "sceneCaption": "A shopping basket (eye-like net) over a shelf of goods. Time to buy something!",
    "sceneHighlightWords": [
      "buy"
    ],
    "mnemonicHook": "A net over money goods",
    "mnemonicBody": "買 looks like a net or basket over shells (old money). You scoop up goods when you buy.",
    "sceneTint": "#d4b06a",
    "examples": [
      {
        "tokens": [
          {
            "text": "パンを",
            "reading": null,
            "highlight": false
          },
          {
            "text": "買います",
            "reading": "かいます",
            "highlight": true
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I buy bread.",
        "englishHighlight": "buy"
      },
      {
        "tokens": [
          {
            "text": "買い物",
            "reading": "かいもの",
            "highlight": true
          },
          {
            "text": "に",
            "reading": null,
            "highlight": false
          },
          {
            "text": "行きます",
            "reading": "いきます",
            "highlight": false
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I go shopping.",
        "englishHighlight": "shopping"
      },
      {
        "tokens": [
          {
            "text": "高い",
            "reading": "たかい",
            "highlight": false
          },
          {
            "text": "靴",
            "reading": "くつ",
            "highlight": false
          },
          {
            "text": "を",
            "reading": null,
            "highlight": false
          },
          {
            "text": "買いました",
            "reading": "かいました",
            "highlight": true
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I bought expensive shoes.",
        "englishHighlight": "bought"
      }
    ]
  },
  {
    "id": "nomu",
    "sceneImage": "/scenes/nomu.png",
    "kanji": "飲",
    "hiragana": "のむ",
    "romaji": "no / in",
    "meaning": "DRINK",
    "category": "Daily life",
    "sceneCaption": "Food on the left, a yawning mouth on the right. Open up and drink!",
    "sceneHighlightWords": [
      "drink"
    ],
    "mnemonicHook": "Food + open mouth",
    "mnemonicBody": "飲 pairs 食 (food) with a person opening their mouth. That is drink.",
    "sceneTint": "#6fa8b8",
    "examples": [
      {
        "tokens": [
          {
            "text": "水",
            "reading": "みず",
            "highlight": false
          },
          {
            "text": "を",
            "reading": null,
            "highlight": false
          },
          {
            "text": "飲みます",
            "reading": "のみます",
            "highlight": true
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "I drink water.",
        "englishHighlight": "drink"
      },
      {
        "tokens": [
          {
            "text": "お茶",
            "reading": "おちゃ",
            "highlight": false
          },
          {
            "text": "を",
            "reading": null,
            "highlight": false
          },
          {
            "text": "飲みましょう",
            "reading": "のみましょう",
            "highlight": true
          },
          {
            "text": "。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "Let's drink tea.",
        "englishHighlight": "drink"
      },
      {
        "tokens": [
          {
            "text": "飲み物",
            "reading": "のみもの",
            "highlight": true
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "何",
            "reading": "なに",
            "highlight": false
          },
          {
            "text": "が",
            "reading": null,
            "highlight": false
          },
          {
            "text": "いいですか。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "What drink would you like?",
        "englishHighlight": "drink"
      }
    ]
  },
  {
    "id": "yasui",
    "sceneImage": "/scenes/yasui.png",
    "kanji": "安",
    "hiragana": "やすい",
    "romaji": "yasu / an",
    "meaning": "CHEAP / SAFE",
    "category": "Adjectives",
    "sceneCaption": "A woman under a roof, at ease. When you feel safe, prices also feel cheap.",
    "sceneHighlightWords": [
      "cheap",
      "safe"
    ],
    "mnemonicHook": "Woman at home, at ease",
    "mnemonicBody": "安 is a woman under a roof. Home feels safe — and YASUI also means cheap.",
    "sceneTint": "#b6c98a",
    "examples": [
      {
        "tokens": [
          {
            "text": "この",
            "reading": null,
            "highlight": false
          },
          {
            "text": "時計",
            "reading": "とけい",
            "highlight": false
          },
          {
            "text": "は",
            "reading": null,
            "highlight": false
          },
          {
            "text": "安い",
            "reading": "やすい",
            "highlight": true
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "This watch is cheap.",
        "englishHighlight": "cheap"
      },
      {
        "tokens": [
          {
            "text": "安心",
            "reading": "あんしん",
            "highlight": true
          },
          {
            "text": "してください。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "Please don't worry.",
        "englishHighlight": "don't worry"
      },
      {
        "tokens": [
          {
            "text": "安全",
            "reading": "あんぜん",
            "highlight": true
          },
          {
            "text": "な",
            "reading": null,
            "highlight": false
          },
          {
            "text": "所",
            "reading": "ところ",
            "highlight": false
          },
          {
            "text": "です。",
            "reading": null,
            "highlight": false
          }
        ],
        "english": "It is a safe place.",
        "englishHighlight": "safe"
      }
    ]
  },

  {
    "id": "ao",
    "sceneImage": "/scenes/ao.png",
    "kanji": "青",
    "hiragana": "あお",
    "romaji": "ao / sei",
    "meaning": "BLUE / GREEN",
    "category": "Adjectives",
    "sceneCaption": "The AO ocean and SEI sky are so blue! (and green!)",
    "sceneHighlightWords": ["blue", "green", "AO", "SEI"],
    "mnemonicHook": "AO = A-Okay",
    "mnemonicBody": "Remember: AO = A-Okay Blue Sky. When the ocean and sky look okay, they look blue!",
    "sceneTint": "#4aa3d9",
    "examples": [
      {
        "tokens": [
          { "text": "青い", "reading": "あおい", "highlight": true },
          { "text": "空", "reading": "そら", "highlight": false },
          { "text": "がきれいです。", "reading": null, "highlight": false }
        ],
        "english": "The blue sky is beautiful.",
        "englishHighlight": "blue sky"
      },
      {
        "tokens": [
          { "text": "信号", "reading": "しんごう", "highlight": false },
          { "text": "が", "reading": null, "highlight": false },
          { "text": "青", "reading": "あお", "highlight": true },
          { "text": "になりました。", "reading": null, "highlight": false }
        ],
        "english": "The traffic light turned green.",
        "englishHighlight": "green"
      },
      {
        "tokens": [
          { "text": "青い", "reading": "あおい", "highlight": true },
          { "text": "鳥", "reading": "とり", "highlight": false },
          { "text": "を", "reading": null, "highlight": false },
          { "text": "見ました", "reading": "みました", "highlight": false },
          { "text": "。", "reading": null, "highlight": false }
        ],
        "english": "I saw a blue bird.",
        "englishHighlight": "blue"
      }
    ]
  }
];

export function wordById(id: string): VocabWord | undefined {
  return words.find((w) => w.id === id);
}

export function categories(): string[] {
  return [...new Set(words.map((w) => w.category))];
}
