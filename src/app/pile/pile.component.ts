import { Component, input, output } from "@angular/core";
import { CardComponent, Card } from "../card/card.component";
import { CdkDropList, CdkDragDrop, CdkDrag } from "@angular/cdk/drag-drop";
import { CardType, CardFace, cardTypeVal } from "../card/card";

@Component({
  selector: "app-base-pile",
  imports: [CardComponent, CdkDropList],
  templateUrl: "./pile.component.html",
  styleUrl: "./pile.component.css",
})
export class BasePileComponent {
  cards = input<Card[]>([]);

  get cardsToRender(): Card[] {
    if (this.cards().length === 0) {
      return [];
    }

    return [this.cards()[this.cards().length - 1]];
  }

  dropCard(event: CdkDragDrop<Card>) {
    console.log(event);
  }

  doubleClickHandler(index: number) {}
}

@Component({
  selector: "app-deck-pile",
  imports: [CardComponent, CdkDropList],
  templateUrl: "./pile.component.html",
  styleUrl: "./pile.component.css",
})
export class DeckPileComponent extends BasePileComponent {}

@Component({
  selector: "app-waste-pile",
  imports: [CardComponent, CdkDropList],
  templateUrl: "./pile.component.html",
  styleUrl: "./pile.component.css",
})
export class WastePileComponent extends BasePileComponent {}

@Component({
  selector: "app-foundation-pile",
  imports: [CardComponent, CdkDropList],
  templateUrl: "./pile.component.html",
  styleUrl: "./pile.component.css",
})
export class FoundationPileComponent extends BasePileComponent {}

@Component({
  selector: "app-tableau-pile",
  templateUrl: "./pile.component.html",
  imports: [CardComponent, CdkDropList],
  styleUrl: "./pile.component.css",
})
export class TableauPileComponent extends BasePileComponent {
  index = input.required<number>();
  moveToFoundation = output<any>();
  override get cardsToRender(): Card[] {
    return this.cards();
  }

  override dropCard(event: CdkDragDrop<Card>) {
    console.log(event);
    const card = event.item.data;

    if (this.cards().length === 0 && card.type === CardType.King) {
      return this.moveCard(event);
    }

    const topCard = this.cards()[this.cards().length - 1];
    console.log(topCard);
    if (cardTypeVal(topCard) !== cardTypeVal(card) + 1) {
      return;
    }

    let blackCount = 0;
    switch (card.face) {
      case CardFace.Spades:
      case CardFace.Clubs:
        blackCount++;
        break;
    }
    switch (topCard.face) {
      case CardFace.Spades:
      case CardFace.Clubs:
        blackCount++;
        break;
    }

    if (blackCount === 1) {
      return this.moveCard(event);
    }
  }

  moveCard(event: CdkDragDrop<Card>) {
    // move cards
    console.log("can move");
  }

  override doubleClickHandler(cardIndex: number) {
    console.log(cardIndex);
    if (cardIndex === this.cards().length - 1) {
      this.moveToFoundation.emit({
        tableau: this.index(),
        cardIndex,
      });
    }
  }
}
