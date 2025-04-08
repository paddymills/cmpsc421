import { Component, Input } from "@angular/core";

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

@Component({
  selector: "app-card",
  imports: [],
  templateUrl: "./card.component.html",
  styleUrl: "./card.component.css",
})
class CardComponent {
  @Input() type = CardType.Ace;
  @Input() face = CardFace.Spades;

  constructor() {
    this.type = CardType.Ace;
    this.face = CardFace.Spades;
  }

  get asset(): string {
    return `cards/${this.type}_of_${this.face}.png`;
  }

  get name(): string {
    return `${this.type} of ${this.face}`;
  }
}

export { CardComponent, CardType, CardFace };
