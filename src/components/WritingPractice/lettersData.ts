export interface PracticeLetter {
  id: string;
  char: string;
  lang: 'ta' | 'en';
  nameTa: string;
  nameEn: string;
  phonicsTa: string;
  phonicsEn: string;
  wordTa: string;
  wordEn: string;
  wordIcon: string;
  // Step 5 progression: Letter -> Word -> Sentence
  wordSpelling: string; // e.g. "APPLE"
  sentenceEn: string; // e.g. "An apple is sweet and red."
  sentenceTa: string; // e.g. "ஆப்பிள் இனிப்பாகவும் சிவப்பாகவும் இருக்கும்."
  // Stroke guide coordinates on a normalized 400x400 canvas
  guideDots: { x: number; y: number }[];
  instructionTa: string;
  instructionEn: string;
}

export const PRACTICE_LETTERS: PracticeLetter[] = [
  {
    id: 'en_a',
    char: 'A',
    lang: 'en',
    nameTa: 'ஆங்கில எழுத்து A',
    nameEn: 'Letter A',
    phonicsTa: 'ஏ (A for Apple)',
    phonicsEn: '/æ/ as in Apple',
    wordTa: 'Apple (ஆப்பிள்)',
    wordEn: 'Apple',
    wordIcon: '🍎',
    wordSpelling: 'APPLE',
    sentenceEn: 'An apple is sweet and red.',
    sentenceTa: 'ஆப்பிள் இனிப்பாகவும் சிவப்பாகவும் இருக்கும்.',
    guideDots: [
      { x: 200, y: 70 },
      { x: 170, y: 140 },
      { x: 140, y: 220 },
      { x: 100, y: 320 }, // Left diagonal
      { x: 200, y: 70 },
      { x: 230, y: 140 },
      { x: 260, y: 220 },
      { x: 300, y: 320 }, // Right diagonal
      { x: 135, y: 230 },
      { x: 200, y: 230 },
      { x: 265, y: 230 }, // Middle crossbar
    ],
    instructionTa: 'மேலிருந்து இடதுபுறமும், மேலிருந்து வலதுபுறமும் கோடு வரைந்து, நடுவில் இணைக்கவும்.',
    instructionEn: 'Draw down to the left, down to the right, then connect across the middle.',
  },
  {
    id: 'ta_a',
    char: 'அ',
    lang: 'ta',
    nameTa: 'உயிர் எழுத்து "அ"',
    nameEn: 'Tamil Vowel "A"',
    phonicsTa: 'அ (அணில்)',
    phonicsEn: '/a/ as in Anil (Squirrel)',
    wordTa: 'அணில் (Squirrel)',
    wordEn: 'Squirrel',
    wordIcon: '🐿️',
    wordSpelling: 'அணில்',
    sentenceEn: 'The squirrel climbed the tree.',
    sentenceTa: 'அணில் மரத்தில் சுறுசுறுப்பாக ஏறியது.',
    guideDots: [
      { x: 150, y: 120 },
      { x: 125, y: 150 },
      { x: 150, y: 180 },
      { x: 185, y: 150 },
      { x: 175, y: 120 }, // Top loop
      { x: 230, y: 140 },
      { x: 270, y: 190 },
      { x: 250, y: 260 },
      { x: 190, y: 270 }, // Big belly curve
      { x: 130, y: 270 },
      { x: 280, y: 270 }, // Horizontal bridge
      { x: 280, y: 140 },
      { x: 280, y: 320 }, // Vertical stem
    ],
    instructionTa: 'சுழித்துத் தொடங்கி, வளைத்து வந்து, படுக்கைக் கோடு இட்டு நேர்கோடு இறக்கவும்.',
    instructionEn: 'Start with a top loop, curve down into the belly, draw horizontal bar and vertical stem.',
  },
  {
    id: 'en_b',
    char: 'B',
    lang: 'en',
    nameTa: 'ஆங்கில எழுத்து B',
    nameEn: 'Letter B',
    phonicsTa: 'பி (B for Ball)',
    phonicsEn: '/b/ as in Ball',
    wordTa: 'Ball (பந்து)',
    wordEn: 'Ball',
    wordIcon: '⚽',
    wordSpelling: 'BALL',
    sentenceEn: 'The ball bounces high into the sky.',
    sentenceTa: 'பந்து வானில் உயரமாக எழும்புகிறது.',
    guideDots: [
      { x: 120, y: 80 },
      { x: 120, y: 200 },
      { x: 120, y: 320 }, // Vertical spine
      { x: 120, y: 80 },
      { x: 210, y: 90 },
      { x: 250, y: 140 },
      { x: 210, y: 200 },
      { x: 120, y: 200 }, // Upper bump
      { x: 220, y: 210 },
      { x: 270, y: 260 },
      { x: 220, y: 320 },
      { x: 120, y: 320 }, // Lower bump
    ],
    instructionTa: 'நேர்கோடு வரைந்து, மேல் வளைவு மற்றும் கீழ் வளைவு அமைக்கவும்.',
    instructionEn: 'Draw a straight line down, then add two rounded loops on the right.',
  },
  {
    id: 'ta_aa',
    char: 'ஆ',
    lang: 'ta',
    nameTa: 'உயிர் எழுத்து "ஆ"',
    nameEn: 'Tamil Vowel "Aa"',
    phonicsTa: 'ஆ (ஆலமரம்)',
    phonicsEn: '/aa/ as in Aalamaram (Banyan)',
    wordTa: 'ஆலமரம் (Banyan Tree)',
    wordEn: 'Banyan Tree',
    wordIcon: '🌳',
    wordSpelling: 'ஆலமரம்',
    sentenceEn: 'The banyan tree gives cool shade.',
    sentenceTa: 'ஆலமரம் குளிர்ந்த நிழல் தருகிறது.',
    guideDots: [
      { x: 140, y: 110 },
      { x: 120, y: 140 },
      { x: 140, y: 170 },
      { x: 170, y: 140 },
      { x: 220, y: 130 },
      { x: 250, y: 180 },
      { x: 230, y: 250 },
      { x: 170, y: 260 },
      { x: 260, y: 260 },
      { x: 260, y: 120 },
      { x: 260, y: 300 },
      { x: 280, y: 320 },
      { x: 310, y: 290 }, // Bottom swirl loop
    ],
    instructionTa: '"அ" போன்று எழுதி, அடியில் அழகிய சுழி வளைவை சேர்க்கவும்.',
    instructionEn: 'Write "அ" and extend a bottom loop curve upwards.',
  },
  {
    id: 'en_c',
    char: 'C',
    lang: 'en',
    nameTa: 'ஆங்கில எழுத்து C',
    nameEn: 'Letter C',
    phonicsTa: 'சி (C for Cat)',
    phonicsEn: '/k/ as in Cat',
    wordTa: 'Cat (பூனை)',
    wordEn: 'Cat',
    wordIcon: '🐱',
    wordSpelling: 'CAT',
    sentenceEn: 'The cat drinks warm milk happily.',
    sentenceTa: 'பூனை பாலை மகிழ்ச்சியாக குடிக்கிறது.',
    guideDots: [
      { x: 280, y: 110 },
      { x: 220, y: 80 },
      { x: 150, y: 110 },
      { x: 110, y: 200 },
      { x: 150, y: 290 },
      { x: 220, y: 320 },
      { x: 280, y: 290 },
    ],
    instructionTa: 'வலது மேலிருந்து இடதுபுறமாக அரைவட்டமாக வளைத்து வரவும்.',
    instructionEn: 'Start top right, curve left and swoop down to bottom right.',
  },
];
