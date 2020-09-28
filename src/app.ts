import { readDecks, CardType } from './read_decks';

(async () => {
  const decks = await readDecks();

  console.log(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
  </head>
  <body>
  `);

  for (const deck of decks) {
    // console.log(deck.letter, deck.name);
    console.log(`
    <h1>Deck ${deck.letter} - ${deck.name}</h1>
    <table style="width:100%" border = "1">
    `);

    for (let cardIndex = 0; cardIndex < deck.cards.length; cardIndex++) {
      const isLeftColumn = cardIndex % 2 === 0;
      if (isLeftColumn) {
        console.log('<tr>');
      }

      const card = deck.cards[cardIndex];
      const typeEn = toTypeEn(card.type);
      const interruptEn = card.isInterrupt ? ' - interrupt' : '';
      const typePl = toTypePl(card.type);
      const interruptPl = card.isInterrupt ? ' - przerwanie' : '';
      // console.log(' ', card.no, card.textEn, card.textPl, card.type, card.isInterrupt);

      console.log(`
      <td>
      <b>(${typePl}${interruptPl})</b><br>
      ${ card.textPl} <br><br>
      <b>(${ typeEn}${interruptEn})</b><br>
      ${card.textEn}
      </td>
      `);

      if (!isLeftColumn) {
        console.log('</tr>');
      }
    }

    console.log(`</table>`);
  }

  console.log(`
  </body>
</html>
  `);
})();

function toTypeEn(type: CardType): String {
  switch (type) {
    case CardType.Event: return 'Event';
    case CardType.Thing: return 'Thing';
    case CardType.Aspect: return 'Aspect';
    case CardType.Place: return 'Place';
    case CardType.Character: return 'Character';
    case CardType.Ending: return 'Ending';
  }
}

function toTypePl(type: CardType): String {
  switch (type) {
    case CardType.Event: return 'Wydarzenie';
    case CardType.Thing: return 'Przedmiot';
    case CardType.Aspect: return 'Przymiotnik';
    case CardType.Place: return 'Miejsce';
    case CardType.Character: return 'Postać';
    case CardType.Ending: return 'Zakończenie';
  }
}
