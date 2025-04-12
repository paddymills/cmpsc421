import { Component, input } from "@angular/core";
import { Card } from "./card";
import { CdkDrag } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrl: "./card.component.css",
  imports: [CdkDrag],
})
class CardComponent {
  card = input<Card | null>(null);
  next = input<Card | null>(null);

  constructor() {
    console.log(this.card());
  }

  get asset(): string {
    return `cards/${this.card()?.type}_of_${this.card()?.face}.png`;
  }

  get name(): string {
    return `${this.card()?.type} of ${this.card()?.face}`;
  }
}

export { CardComponent, type Card };
