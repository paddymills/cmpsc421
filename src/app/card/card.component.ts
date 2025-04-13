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
  card = input.required<Card>();
  // next = input<Card | null>(null);

  get asset(): string {
    return `cards/${this.card()?.type}_of_${this.card()?.face}.png`;
  }

  get name(): string {
    return `${this.card()?.type} of ${this.card()?.face}`;
  }

  get show(): boolean {
    return this.card().visible;
  }
}

export { CardComponent, type Card };
