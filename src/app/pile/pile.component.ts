import { Component, input, computed } from "@angular/core";
import { CardComponent, Card } from "../card/card.component";

enum PileType {
  Deck = 1,
  Waste = 2,
  Foundation = 3,
  Tableau = 4,
}

@Component({
  selector: "app-pile",
  imports: [CardComponent],
  templateUrl: "./pile.component.html",
  styleUrl: "./pile.component.css",
})
export class PileComponent {
  cards = input<Card[]>([]);
  get topCard(): Card | null {
    if (this.cards().length === 0) {
      return null;
    }

    return this.cards()[this.cards().length - 1];
  }
}
