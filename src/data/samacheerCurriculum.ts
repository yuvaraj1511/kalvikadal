import { ClassMetadata } from '../types';

export const CLASSES_DATA: ClassMetadata[] = [
  {
    id: 1,
    titleTa: 'வகுப்பு 1',
    titleEn: 'Class 1',
    themeNameTa: 'விளையாட்டு & வடிவங்கள் உலகம்',
    themeNameEn: 'Toys & Shapes Realm',
    icon: '🧸',
    heroImage: '/src/assets/images/theme_toys_shapes_1790177627462.jpg',
    accentColor: 'from-amber-500 to-orange-500',
    gradientBg: 'bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200/50',
    lightBg: 'bg-amber-50',
    borderColor: 'border-amber-300',
    pillBorder: 'border-amber-400',
    summaryTa: 'உயிர் எழுத்துக்கள் (அ முதல் ஔ வரை) மற்றும் எளிய 1-10 எண்ணுதல் விளையாட்டு.',
    summaryEn: 'Focus on basic Tamil letters (Uyir Ezhuthukkal) and counting toys 1 to 10.',
    focusPointsTa: [
      'உயிர் எழுத்துக்கள் ஒலித்தல் & அறிதல்',
      'பொம்மைகள் எண்ணுதல் (1 முதல் 10 வரை)',
      'அடிப்படை வடிவங்கள் (வட்டம், சதுரம், முக்கோணம்)',
      'வண்ணங்கள் மற்றும் எளிய உச்சரிப்பு'
    ],
    focusPointsEn: [
      'Basic Tamil letters (Uyir Ezhuthukkal: அ to ஔ)',
      'Toy counting numbers 1 to 10',
      'Basic geometric shapes (Circle, Square, Triangle)',
      'Colors, sounds & phonemic awareness'
    ],
    samacheerTopics: {
      tamil: 'பாடல், உயிர் எழுத்துக்கள் 12, ஆய்த எழுத்து (ஃ), படங்கள் பார்த்து சொல்',
      english: 'Alphabet phonics A-Z, action songs, basic greetings',
      math: 'Pre-math concepts (big/small, tall/short), counting 1 to 20, simple shapes',
      evsScience: 'My Body (என் உடல்), Cleanliness & Healthy Habits, Family & Home'
    },
    sampleActivities: [
      { id: 'c1_vowels', titleTa: 'உயிர் எழுத்து ரயில்', titleEn: 'Uyir Vowel Train', type: 'tamil', minutes: 5 },
      { id: 'c1_counting', titleTa: 'பொம்மை கூடை & வடிவங்கள்', titleEn: 'Toy Basket & Shapes', type: 'math', minutes: 5 }
    ]
  },
  {
    id: 2,
    titleTa: 'வகுப்பு 2',
    titleEn: 'Class 2',
    themeNameTa: 'மாயாஜால விலங்குகள் சோலை',
    themeNameEn: 'Fantasy Animal Meadow',
    icon: '🦄',
    heroImage: '/src/assets/images/theme_fantasy_animals_1790177639461.jpg',
    accentColor: 'from-fuchsia-500 to-pink-500',
    gradientBg: 'bg-gradient-to-br from-pink-100 via-fuchsia-50 to-purple-100/50',
    lightBg: 'bg-pink-50',
    borderColor: 'border-pink-300',
    pillBorder: 'border-pink-400',
    summaryTa: 'எளிய தமிழ் சொற்கள் மற்றும் எளிய கூட்டல் / கழித்தல் விலங்கு சாகசம்.',
    summaryEn: 'Focus on simple words, animal names, and basic addition/subtraction puzzles.',
    focusPointsTa: [
      'மெய் எழுத்துக்கள் & எளிய சொல் உருவாக்கம்',
      'விலங்குகள், பறவைகள் பெயர்கள்',
      'கூட்டல் மற்றும் கழித்தல் (+ and -)',
      'இரு இலக்க எண்கள் (1 முதல் 99 வரை)'
    ],
    focusPointsEn: [
      'Tamil consonant blends (Mei Ezhuthukkal) & 2-letter words',
      'Animal & nature vocabulary in Tamil & English',
      'Single and 2-digit addition and subtraction',
      'Measurement basics (length, weight comparison)'
    ],
    samacheerTopics: {
      tamil: 'சொல் விளையாட்டு, மெய் எழுத்துக்கள் 18, ஆத்திசூடி வரிகள், விலங்கு உலகம்',
      english: 'Sight words, simple sentences, rhyming words, naming words (nouns)',
      math: 'Addition & Subtraction within 99, skip counting (2s, 5s, 10s), pattern recognition',
      evsScience: 'Animal Kingdom, Plant habitats, Water sources, Day & Night cycle'
    },
    sampleActivities: [
      { id: 'c2_words', titleTa: 'விலங்கு சொல் தோட்டம்', titleEn: 'Animal Word Garden', type: 'tamil', minutes: 5 },
      { id: 'c2_math', titleTa: 'வானவில் கூட்டல் சோலை', titleEn: 'Rainbow Math Meadow', type: 'math', minutes: 5 }
    ]
  },
  {
    id: 3,
    titleTa: 'வகுப்பு 3',
    titleEn: 'Class 3',
    themeNameTa: 'விண்வெளி ஆய்வு மையம்',
    themeNameEn: 'Space Exploration Hub',
    icon: '🚀',
    heroImage: '/src/assets/images/theme_space_explorer_1790177650374.jpg',
    accentColor: 'from-sky-500 to-indigo-600',
    gradientBg: 'bg-gradient-to-br from-sky-100 via-indigo-50 to-blue-200/50',
    lightBg: 'bg-sky-50',
    borderColor: 'border-sky-300',
    pillBorder: 'border-sky-400',
    summaryTa: 'இடமதிப்பு, பல இலக்க எண்கள் கணிதம் மற்றும் சூழ்நிலையியல் (EVS) ஆய்வு.',
    summaryEn: 'Multi-digit math, place value, and environmental studies (EVS) quests.',
    focusPointsTa: [
      'இடமதிப்பு (ஒன்று, பத்து, நூறு, ஆயிரம்)',
      'பெருக்கல் வாய்ப்பாடுகள் & கூட்டல் விண்வெளி சவால்',
      'இயற்கை வளம் & நீரின் சுழற்சி',
      'சூரிய குடும்பம் & தாவரத்தின் பாகங்கள்'
    ],
    focusPointsEn: [
      'Multi-digit math & place values (1s, 10s, 100s, 1000s)',
      'Multiplication tables (2x to 10x) cosmic blaster',
      'Environmental Studies (EVS): water cycle, soil, seasons',
      'Solar system planets, plant leaf anatomy & habitats'
    ],
    samacheerTopics: {
      tamil: 'நல்வழிப் பாடல்கள், திருக்குறள் எளிய பொருள், வல்லினம்/மெல்லினம்/இடையினம்',
      english: 'Grammar: action verbs, adjectives, prepositions, reading comprehension',
      math: '3-digit addition/subtraction, introduction to multiplication & division, time reading',
      evsScience: 'Living vs Non-Living, Water Cycle, Food & Nutrition, Tamil Nadu Geography'
    },
    sampleActivities: [
      { id: 'c3_space_math', titleTa: 'ராக்கெட் இடமதிப்பு தளம்', titleEn: 'Rocket Place Value Deck', type: 'math', minutes: 5 },
      { id: 'c3_space_evs', titleTa: 'விண்வெளி EVS கண்டுபிடிப்பு', titleEn: 'Space EVS Explorer', type: 'science', minutes: 5 }
    ]
  },
  {
    id: 4,
    titleTa: 'வகுப்பு 4',
    titleEn: 'Class 4',
    themeNameTa: 'புதையல் தீவு சாகசம்',
    themeNameEn: 'Treasure Hunt Island',
    icon: '🗺️',
    heroImage: '/src/assets/images/theme_treasure_island_1790177661934.jpg',
    accentColor: 'from-emerald-600 to-teal-600',
    gradientBg: 'bg-gradient-to-br from-emerald-100 via-teal-50 to-green-200/50',
    lightBg: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    pillBorder: 'border-emerald-400',
    summaryTa: 'அறிவியல் சோதனைகள், காந்தவியல், மற்றும் பின்னங்கள் (Fractions) புதையல் புதிர்.',
    summaryEn: 'Science experiments (matter, magnets), fraction puzzles & compass navigation.',
    focusPointsTa: [
      'பின்னங்கள் (அரை 1/2, கால் 1/4, முக்கால் 3/4)',
      'பொருட்களின் நிலைகள் (திண்மம், நீர்மம், வாயு)',
      'காந்த விசை & அறிவியல் பரிசோதனைகள்',
      'நீளம், எடை, கொள்ளளவு அளவைகள்'
    ],
    focusPointsEn: [
      'Fraction puzzles: Halves, Quarters, 3/4ths & equivalence',
      'States of matter: Solids, Liquids, Gases & phase changes',
      'Magnetic attraction/repulsion laboratory',
      'Unit conversions (meters, grams, liters) & perimeter'
    ],
    samacheerTopics: {
      tamil: 'மூதுரை செய்யுள், எதிர்ச்சொல், பிரித்து எழுதுக, வரலாற்று சிறுகதைகள்',
      english: 'Tenses (past, present, future), adverbs, conjunctions, story writing',
      math: 'Fraction concepts, 4-digit operations, factors & multiples, area & perimeter',
      evsScience: 'Matter & Materials, Plants & Photosynthesis, Magnetism, Green Energy'
    },
    sampleActivities: [
      { id: 'c4_fractions', titleTa: 'பின்னங்கள் தங்கப் பேழை', titleEn: 'Fraction Treasure Chest', type: 'math', minutes: 5 },
      { id: 'c4_science', titleTa: 'காந்தவியல் அறிவியல் கூடம்', titleEn: 'Magnetic Science Lab', type: 'science', minutes: 5 }
    ]
  },
  {
    id: 5,
    titleTa: 'வகுப்பு 5',
    titleEn: 'Class 5',
    themeNameTa: 'மன்னர் சோழர் கோட்டை',
    themeNameEn: 'Royal Kingdom & History',
    icon: '👑',
    heroImage: '/src/assets/images/theme_royal_kingdom_1790177673833.jpg',
    accentColor: 'from-violet-600 to-amber-600',
    gradientBg: 'bg-gradient-to-br from-amber-100 via-purple-50 to-yellow-100/50',
    lightBg: 'bg-purple-50',
    borderColor: 'border-purple-300',
    pillBorder: 'border-purple-400',
    summaryTa: 'சிக்கலான கணிதக் கணக்குகள், மேம்பட்ட இலக்கணம், மற்றும் வரலாறு சிந்தனை.',
    summaryEn: 'Critical thinking, advanced grammar, historical problem solving, and word problems.',
    focusPointsTa: [
      'வார்த்தைக் கணக்குகள் (Word problems: லாபம், நட்டம், காலம்)',
      'தமிழ் இலக்கணம் (திணை, பால், எண், இடம்)',
      'சோழர், சேரர், பாண்டியர் வரலாற்றுப் பெருமை',
      'ஆராய்ச்சி சிந்தனை & தர்க்க புதிர்கள்'
    ],
    focusPointsEn: [
      'Multi-step word problems (profit/loss, speed-time, averages)',
      'Advanced Tamil grammar (Thinai, Paal, En, Idam) & English parts of speech',
      'Sangam age history, Chola architecture & irrigation wisdom',
      'Critical thinking, logic puzzles & data interpretation'
    ],
    samacheerTopics: {
      tamil: 'திருக்குறள் அதிகாரங்கள், புறநானூறு பாடல்கள், மரபுச்சொற்கள், கட்டுரை வரைதல்',
      english: 'Direct/Indirect concepts, active voice, essay construction, advanced idioms',
      math: 'Decimals, percentages, unitary method, volume & geometry angles',
      evsScience: 'Historical Kingdoms of TN, Human Organ Systems, Atmospheric Pressure, Eco-systems'
    },
    sampleActivities: [
      { id: 'c5_kingdom_math', titleTa: 'மன்னர் ராஜராஜன் புதிர்கள்', titleEn: 'King Raja Raja Math Quests', type: 'math', minutes: 5 },
      { id: 'c5_grammar', titleTa: 'இலக்கண அரசவை களம்', titleEn: 'Royal Grammar Court', type: 'tamil', minutes: 5 }
    ]
  }
];

export const BADGES_LIST = [
  { id: 'vowel_explorer', nameTa: 'உயிர் எழுத்து நாயகன்', nameEn: 'Vowel Explorer', icon: '🌟', descTa: 'வகுப்பு 1 எழுத்து விளையாட்டை முடித்தார்', descEn: 'Completed Class 1 Tamil vowel train' },
  { id: 'toy_counter', nameTa: 'வடிவங்களின் மாஸ்டர்', nameEn: 'Shape Sorter', icon: '🧸', descTa: '10 எண்களையும் வடிவங்களையும் சரியாக அடுக்கினார்', descEn: 'Sorted all 10 shapes and toys' },
  { id: 'animal_linguist', nameTa: 'விலங்கு சொல் மேதை', nameEn: 'Creature Scholar', icon: '🦄', descTa: 'விலங்கு சொற்களை கண்டுபிடித்தார்', descEn: 'Mastered Class 2 animal vocabulary' },
  { id: 'cosmic_captain', nameTa: 'விண்வெளி தளபதி', nameEn: 'Cosmic Captain', icon: '🚀', descTa: 'இடமதிப்பு ராக்கெட்டை ஏவினார்', descEn: 'Launched the multi-digit rocket' },
  { id: 'fraction_pirate', nameTa: 'பின்ன புதையல் வேடன்', nameEn: 'Fraction Navigator', icon: '🗺️', descTa: 'அனைத்து பின்ன புதிர்களையும் அவிழ்த்தார்', descEn: 'Unlocked the fraction treasure chest' },
  { id: 'kingdom_scholar', nameTa: 'சோழர் அரசவை அறிஞர்', nameEn: 'Kingdom Scholar', icon: '👑', descTa: 'மன்னரின் தர்க்க புதிர்களை வென்றார்', descEn: 'Solved King Raja Raja word challenges' }
];
