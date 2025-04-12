import { Component, output } from "@angular/core";
import { PileComponent } from "../pile/pile.component";
import { Deck } from "../pile/deck";
import { Card, randomCard } from "../card/card";

@Component({
  selector: "app-game",
  imports: [PileComponent],
  templateUrl: "./game.component.html",
  styleUrl: "./game.component.css",
})
export class GameComponent {
  deck: Deck = new Deck();
  waste = [randomCard()];
  spadesPile = [];
  clubsPile = [];
  heartsPile = [];
  diamondsPile = [];
  tableau: Card[][] = [];

  constructor() {
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

    console.log("game built");
  }
}
