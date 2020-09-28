import { promises as fs } from 'fs';

// Export

export interface Deck {
  readonly letter: string;
  readonly name: string;
  readonly cards: Card[];
}

export interface Card {
  readonly no: string;
  readonly textEn: string;
  readonly textPl: string;
  readonly type: CardType;
  readonly isInterrupt: boolean;
}

export enum CardType {
  Event,
  Thing,
  Aspect,
  Place,
  Character,
  Ending
}

export async function readDecks(): Promise<Deck[]> {
  const decksEn = await readDecksEn();
  const decksPl = await readDecksPl();

  if (decksEn.length !== decksPl.length) {
    console.error(`decksEn.length: ${decksEn.length}, decksPl.length: ${decksPl.length}`);
    process.exit(-1);
  }

  const decks: Deck[] = [];
  for (let deckIndex = 0; deckIndex < decksEn.length; deckIndex++) {
    const deckEn = decksEn[deckIndex];
    const deckPl = decksPl[deckIndex];

    if (deckEn.letter !== deckPl.letter) {
      console.error(`deckEn: ${deckEn.letter}, deckPl: ${deckPl.letter}`);
      process.exit(-1);
    }

    if (deckEn.cards.length !== deckPl.cards.length) {
      console.error(`deckEn.cards: ${deckEn.cards.length}, deckPl.cards: ${deckPl.cards.length}`);
      process.exit(-1);
    }

    const cards: Card[] = [];
    for (let cardIndex = 0; cardIndex < deckEn.cards.length; cardIndex++) {
      const cardEn = deckEn.cards[cardIndex];
      const cardPl = deckPl.cards[cardIndex];

      if (cardEn.no !== cardPl.no) {
        console.error(`cardEn.no: ${cardEn.no}, cardPl.no: ${cardPl.no}`);
        process.exit(-1);
      }

      cards.push({
        no: cardEn.no,
        textEn: cardEn.text,
        textPl: cardPl.text,
        type: cardEn.type,
        isInterrupt: cardEn.isInterrupt
      });
    }

    decks.push({
      letter: deckEn.letter,
      name: deckEn.name,
      cards: cards
    });
  }

  return decks;
}

// En

interface DeckEn {
  readonly letter: string;
  readonly name: string;
  cards: CardEn[];
}

interface CardEn {
  readonly no: string;
  readonly text: string;
  readonly type: CardType;
  readonly isInterrupt: boolean;
}

async function readDecksEn(): Promise<DeckEn[]> {
  const file = './Cards.en.csv';
  const fileContent = await fs.readFile(file, 'utf8');

  const decks: DeckEn[] = [];
  let currentDeck: DeckEn | undefined;

  for (const line of fileContent.split('\n')) {
    if (line.length < 1 || line.startsWith(';')) {
      continue
    }

    if (line.startsWith('DECK')) {
      const deck: DeckEn = {
        letter: line.substring(5, 6),
        name: line.substring(8),
        cards: []
      };

      currentDeck = deck;
      decks.push(deck);
      continue
    }

    // Normal card
    const [no, textRaw, typeRaw] = line.split(';')

    const card: CardEn = {
      no: no.trim(),
      text: textRaw.replace('*', '').trim(),
      type: parseCardType(typeRaw),
      isInterrupt: typeRaw.includes('-INT')
    };

    if (currentDeck != undefined) {
      currentDeck.cards.push(card);
    }
  }

  return decks;
}

function parseCardType(rawTypeEn: String): CardType {
  const raw = rawTypeEn.replace('-INT', '').trim();

  switch (raw) {
    case 'Event':
      return CardType.Event;
    case 'Ending':
      return CardType.Ending;
    case 'Thing':
      return CardType.Thing;
    case 'Aspect':
      return CardType.Aspect;
    case 'Place':
      return CardType.Place;
    case 'Character':
      return CardType.Character;
    default:
      console.error(`Card type '${raw}' is not supported!`);
      process.exit(-1);
      return CardType.Ending;
  }
}

// Pl

interface DeckPl {
  readonly letter: string;
  cards: CardPl[];
}

interface CardPl {
  readonly no: string;
  readonly text: string;
}

async function readDecksPl(): Promise<DeckPl[]> {
  const file = './Cards.pl.csv';
  const fileContent = await fs.readFile(file, 'utf8');

  const decks: DeckPl[] = [];
  let currentDeck: DeckPl | undefined;

  for (const line of fileContent.split('\n')) {
    if (line.length < 1 || line.startsWith(';')) {
      continue
    }

    if (line.startsWith('POKŁAD')) {
      const deck: DeckPl = {
        letter: line.substring(7, 8),
        cards: []
      };

      currentDeck = deck;
      decks.push(deck);
      continue
    }

    // Normal card
    const [no, textRaw] = line.split(';')
    const text = textRaw.replace('*', '').trim()

    const card: CardPl = {
      no: no.trim(),
      text: text[0].toUpperCase() + text.substring(1)
    };

    if (currentDeck != undefined) {
      currentDeck.cards.push(card);
    }
  }

  return decks;
}
