import { Component, input, output } from "@angular/core";
import { CardComponent, CardType, CardFace } from "../card/card.component";

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
  name = input<string>("new pile");
  type = input<CardType>(CardType.Four);
  face = input<CardFace>(CardFace.Diamonds);
}
