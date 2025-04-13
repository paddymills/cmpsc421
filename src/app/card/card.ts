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
  visible: boolean;
};

function cardTypeVal(card: Card): number {
  switch (card.type) {
    case CardType.Ace:
      return 1;
    case CardType.Two:
      return 2;
    case CardType.Three:
      return 3;
    case CardType.Four:
      return 4;
    case CardType.Five:
      return 5;
    case CardType.Six:
      return 6;
    case CardType.Seven:
      return 7;
    case CardType.Eight:
      return 8;
    case CardType.Nine:
      return 9;
    case CardType.Ten:
      return 10;
    case CardType.Jack:
      return 11;
    case CardType.Queen:
      return 12;
    case CardType.King:
      return 13;
  }
}

function randomCard(): Card {
  const types = Object.values(CardType);
  const faces = Object.values(CardFace);
  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomFace = faces[Math.floor(Math.random() * faces.length)];
  return { type: randomType, face: randomFace, visible: true };
}

export { CardType, CardFace, type Card, randomCard, cardTypeVal };
