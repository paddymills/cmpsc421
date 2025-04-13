import { Component, output } from "@angular/core";
import {
  DeckPileComponent,
  WastePileComponent,
  FoundationPileComponent,
  TableauPileComponent,
} from "../pile/pile.component";
import { Deck } from "../pile/deck";
import { Card, CardFace, cardTypeVal } from "../card/card";

export class Game {
  deck: Deck;
  waste: Array<Card> = [];
  foundation: { [key in CardFace]: Card[] };
  tableau: Card[][] = [];

  constructor() {
    this.deck = new Deck();
    this.foundation = {
      [CardFace.Spades]: [],
      [CardFace.Clubs]: [],
      [CardFace.Hearts]: [],
      [CardFace.Diamonds]: [],
    };

    for (let i = 0; i < 7; i++) {
      this.tableau.push([]);
      for (let j = 0; j < i + 1; j++) {
        const card: Card | null = this.deck.drawCard();
        if (card) {
          this.tableau[i].push(card);
        } else {
          console.log(
            "No more cards in deck in game constructor. WHY DID THIS HAPPEN?!?!?!?",
          );
        }
      }
    }

    for (const tableauPile of this.tableau) {
      tableauPile[tableauPile.length - 1].visible = true;
    }
  }
  drawCard() {
    if (this.deck.length === 0) {
      this.deck.fromWaste(this.waste);
    } else {
      const card = this.deck.drawCard();
      if (card) {
        card.visible = true;
        this.waste.push(card);
      } else {
        console.log(
          "No more cards in deck in game drawCard. WHY DID THIS HAPPEN?!?!?!?",
        );
      }
    }
  }
}

@Component({
  selector: "app-game",
  imports: [
    DeckPileComponent,
    WastePileComponent,
    FoundationPileComponent,
    TableauPileComponent,
  ],
  templateUrl: "./game.component.html",
  styleUrl: "./game.component.css",
})
export class GameComponent {
  game: Game;

  constructor() {
    this.game = new Game();
  }

  moveToFound(params: any) {
    console.log(params);
    const card = this.game.tableau[params.tableau][params.cardIndex];
    const foundation = this.game.foundation[card.face];

    const foundationTop =
      foundation.length > 0
        ? cardTypeVal(foundation[foundation.length - 1])
        : 0;
    const val = cardTypeVal(card);
    if (val === foundationTop + 1) {
      this.game.foundation[card.face].push(card);
      this.game.tableau[params.tableau].splice(params.cardIndex, 1);

      if (this.game.tableau[params.tableau].length > 0) {
        this.game.tableau[params.tableau][
          this.game.tableau[params.tableau].length - 1
        ].visible = true;
      }
    }
  }
}
