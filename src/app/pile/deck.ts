import { Card, CardType, CardFace } from "../card/card";

export class Deck extends Array<Card> {
  constructor() {
    super(52);

    const types = Object.values(CardType);
    const faces = Object.values(CardFace);

    // build deck
    let index = 0;
    for (const type of types) {
      for (const face of faces) {
        this[index] = { type, face, visible: false };
        index++;
      }
    }

    // shuffle
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
    }
  }

  drawCard(): Card {
    let card = this.pop();

    if (card) {
      return card;
    } else {
      throw new Error("Failed to draw card");
    }
  }

  fromWaste(waste: Array<Card>) {
    while (waste.length > 0) {
      let card = waste.pop();
      if (card) {
        this.push({ ...card, visible: false });
      }
    }
  }
}
