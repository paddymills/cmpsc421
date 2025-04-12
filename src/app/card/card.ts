enum CardType {
  Ace = "ace",
  Two = "2",
  Three = "3",
  Four = "4",
  Five = "5",
  Six = "6",
  Seven = "7",
  Eight = "8",
  Nine = "9",
  Ten = "10",
  Jack = "jack",
  Queen = "queen",
  King = "king",
}

enum CardFace {
  Spades = "spades",
  Hearts = "hearts",
  Diamonds = "diamonds",
  Clubs = "clubs",
}

type Card = {
  type: CardType;
  face: CardFace;
};

type CardInPlay = {
  card: Card;
  next: CardInPlay | null;
};

function randomCard(): Card {
  const types = Object.values(CardType);
  const faces = Object.values(CardFace);
  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomFace = faces[Math.floor(Math.random() * faces.length)];
  return { type: randomType, face: randomFace };
}

export { CardType, CardFace, type Card, type CardInPlay, randomCard };
