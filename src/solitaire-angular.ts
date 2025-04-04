// First, let's start with the project structure and components we'll need
// File: solitaire-model.ts - Contains game logic and models

export enum Suit {
  CLUBS = 'clubs',
  DIAMONDS = 'diamonds',
  HEARTS = 'hearts',
  SPADES = 'spades'
}

export enum Color {
  RED = 'red',
  BLACK = 'black'
}

export enum Rank {
  ACE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,
  TEN = 10,
  JACK = 11,
  QUEEN = 12,
  KING = 13
}

export class Card {
  suit: Suit;
  rank: Rank;
  faceUp: boolean;

  constructor(suit: Suit, rank: Rank, faceUp: boolean = false) {
    this.suit = suit;
    this.rank = rank;
    this.faceUp = faceUp;
  }

  get color(): Color {
    return (this.suit === Suit.HEARTS || this.suit === Suit.DIAMONDS) ? Color.RED : Color.BLACK;
  }

  get rankName(): string {
    switch (this.rank) {
      case Rank.ACE: return 'A';
      case Rank.JACK: return 'J';
      case Rank.QUEEN: return 'Q';
      case Rank.KING: return 'K';
      default: return String(this.rank);
    }
  }

  get display(): string {
    return `${this.rankName} of ${this.suit}`;
  }

  get cssClasses(): string {
    return `card ${this.suit} rank-${this.rankName.toLowerCase()} ${this.faceUp ? 'face-up' : 'face-down'}`;
  }
}

export class Deck {
  cards: Card[] = [];

  constructor() {
    this.initialize();
  }

  initialize(): void {
    this.cards = [];
    for (const suit of Object.values(Suit)) {
      for (let rank = Rank.ACE; rank <= Rank.KING; rank++) {
        this.cards.push(new Card(suit as Suit, rank));
      }
    }
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  deal(): Card | undefined {
    return this.cards.pop();
  }
}

export class Pile {
  cards: Card[] = [];
  
  get topCard(): Card | undefined {
    return this.cards.length > 0 ? this.cards[this.cards.length - 1] : undefined;
  }
  
  addCard(card: Card): void {
    this.cards.push(card);
  }
  
  removeCard(): Card | undefined {
    return this.cards.pop();
  }
  
  removeCards(index: number): Card[] {
    const removedCards = this.cards.splice(index);
    return removedCards;
  }
  
  canAddCard(card: Card): boolean {
    return true; // Default implementation, to be overridden
  }
}

export class TableauPile extends Pile {
  canAddCard(card: Card): boolean {
    if (this.cards.length === 0) {
      return card.rank === Rank.KING;
    }
    
    const topCard = this.topCard!;
    return topCard.faceUp && 
           topCard.color !== card.color && 
           topCard.rank === card.rank + 1;
  }
  
  canAddCards(cards: Card[]): boolean {
    if (cards.length === 0) return false;
    return this.canAddCard(cards[0]);
  }
  
  flipTopCard(): void {
    const topCard = this.topCard;
    if (topCard && !topCard.faceUp) {
      topCard.faceUp = true;
    }
  }
}

export class FoundationPile extends Pile {
  suit: Suit;
  
  constructor(suit: Suit) {
    super();
    this.suit = suit;
  }
  
  canAddCard(card: Card): boolean {
    if (card.suit !== this.suit) return false;
    
    if (this.cards.length === 0) {
      return card.rank === Rank.ACE;
    }
    
    const topCard = this.topCard!;
    return card.rank === topCard.rank + 1;
  }
}

export class StockPile extends Pile {
  draw(count: number): Card[] {
    const drawnCards: Card[] = [];
    for (let i = 0; i < count && this.cards.length > 0; i++) {
      const card = this.removeCard()!;
      card.faceUp = true;
      drawnCards.push(card);
    }
    return drawnCards;
  }
  
  reset(cards: Card[]): void {
    cards.forEach(card => {
      card.faceUp = false;
    });
    this.cards = cards;
  }
}

export class WastePile extends Pile {
  getDrawnCards(): Card[] {
    return this.cards.filter(card => card.faceUp);
  }
}

export class SolitaireGame {
  deck: Deck;
  stock: StockPile;
  waste: WastePile;
  foundations: FoundationPile[];
  tableaus: TableauPile[];
  
  constructor() {
    this.deck = new Deck();
    this.stock = new StockPile();
    this.waste = new WastePile();
    
    this.foundations = [
      new FoundationPile(Suit.CLUBS),
      new FoundationPile(Suit.DIAMONDS),
      new FoundationPile(Suit.HEARTS),
      new FoundationPile(Suit.SPADES)
    ];
    
    this.tableaus = Array(7).fill(null).map(() => new TableauPile());
  }
  
  initialize(): void {
    this.deck.initialize();
    this.deck.shuffle();
    
    // Clear all piles
    this.stock.cards = [];
    this.waste.cards = [];
    this.foundations.forEach(foundation => foundation.cards = []);
    this.tableaus.forEach(tableau => tableau.cards = []);
    
    // Deal cards to tableau piles
    for (let i = 0; i < this.tableaus.length; i++) {
      for (let j = 0; j <= i; j++) {
        const card = this.deck.deal()!;
        if (j === i) {
          card.faceUp = true;
        }
        this.tableaus[i].addCard(card);
      }
    }
    
    // Move remaining cards to stock
    this.stock.cards = this.deck.cards;
    this.deck.cards = [];
  }
  
  drawFromStock(): void {
    if (this.stock.cards.length === 0) {
      // Reset stock from waste
      this.stock.reset(this.waste.cards);
      this.waste.cards = [];
      return;
    }
    
    const drawnCards = this.stock.draw(1);
    drawnCards.forEach(card => this.waste.addCard(card));
  }
  
  moveCardToFoundation(card: Card, sourceType: string, sourceIndex: number): boolean {
    const foundation = this.foundations.find(f => f.suit === card.suit);
    if (!foundation || !foundation.canAddCard(card)) {
      return false;
    }
    
    if (sourceType === 'waste') {
      this.waste.removeCard();
      foundation.addCard(card);
    } else if (sourceType === 'tableau') {
      const tableau = this.tableaus[sourceIndex];
      tableau.removeCard();
      foundation.addCard(card);
      if (tableau.cards.length > 0) {
        tableau.flipTopCard();
      }
    }
    
    return true;
  }
  
  moveCardToTableau(card: Card, cards: Card[], sourceType: string, sourceIndex: number, targetIndex: number): boolean {
    const targetTableau = this.tableaus[targetIndex];
    if (!targetTableau.canAddCard(card)) {
      return false;
    }
    
    if (sourceType === 'waste') {
      this.waste.removeCard();
      targetTableau.addCard(card);
    } else if (sourceType === 'tableau') {
      const sourceTableau = this.tableaus[sourceIndex];
      const cardIndex = sourceTableau.cards.indexOf(card);
      const movedCards = sourceTableau.removeCards(cardIndex);
      movedCards.forEach(c => targetTableau.addCard(c));
      
      if (sourceTableau.cards.length > 0) {
        sourceTableau.flipTopCard();
      }
    } else if (sourceType === 'foundation') {
      const foundation = this.foundations[sourceIndex];
      foundation.removeCard();
      targetTableau.addCard(card);
    }
    
    return true;
  }
  
  checkWin(): boolean {
    return this.foundations.every(foundation => 
      foundation.cards.length === 13 && foundation.topCard?.rank === Rank.KING);
  }
}

// File: app.module.ts - Main Angular module
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { PileComponent } from './components/pile/pile.component';
import { TableauComponent } from './components/tableau/tableau.component';
import { FoundationComponent } from './components/foundation/foundation.component';
import { StockComponent } from './components/stock/stock.component';
import { WasteComponent } from './components/waste/waste.component';
import { GameBoardComponent } from './components/game-board/game-board.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    PileComponent,
    TableauComponent,
    FoundationComponent,
    StockComponent, 
    WasteComponent,
    GameBoardComponent
  ],
  imports: [
    BrowserModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// File: app.component.ts - Root component
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <h1>Angular Solitaire</h1>
      <app-game-board></app-game-board>
    </div>
  `,
  styles: [`
    .app-container {
      font-family: 'Arial', sans-serif;
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      text-align: center;
      color: #2c3e50;
    }
  `]
})
export class AppComponent {}

// File: components/card/card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../solitaire-model';

@Component({
  selector: 'app-card',
  template: `
    <div class="card"
         [ngClass]="getCardClasses()"
         [cdkDragDisabled]="!card.faceUp || !draggable"
         cdkDrag
         (cdkDragStarted)="onDragStarted()"
         (click)="onClick()">
      <div class="card-content" *ngIf="card.faceUp">
        <div class="card-corner top-left">
          <div class="card-rank">{{card.rankName}}</div>
          <div class="card-suit">{{getSuitSymbol()}}</div>
        </div>
        <div class="card-center">
          <div class="suit-symbol">{{getSuitSymbol()}}</div>
        </div>
        <div class="card-corner bottom-right">
          <div class="card-rank">{{card.rankName}}</div>
          <div class="card-suit">{{getSuitSymbol()}}</div>
        </div>
      </div>
      <div class="card-back" *ngIf="!card.faceUp">
        <div class="card-pattern"></div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      width: 100px;
      height: 140px;
      border-radius: 5px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      background-color: white;
      position: relative;
      cursor: pointer;
      user-select: none;
    }
    
    .card.face-down {
      background-color: #2c3e50;
    }
    
    .card-content {
      width: 100%;
      height: 100%;
      position: relative;
    }
    
    .card-corner {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
    }
    
    .top-left {
      top: 5px;
      left: 5px;
    }
    
    .bottom-right {
      bottom: 5px;
      right: 5px;
      transform: rotate(180deg);
    }
    
    .card.diamonds, .card.hearts {
      color: red;
    }
    
    .card.clubs, .card.spades {
      color: black;
    }
    
    .card-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 32px;
    }
    
    .card-back {
      width: 100%;
      height: 100%;
      background-color: #2c3e50;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .card-pattern {
      width: 80%;
      height: 80%;
      background: repeating-linear-gradient(
        45deg,
        #34495e,
        #34495e 10px,
        #2c3e50 10px,
        #2c3e50 20px
      );
    }
  `]
})
export class CardComponent {
  @Input() card!: Card;
  @Input() draggable: boolean = true;
  @Output() cardClick = new EventEmitter<Card>();
  
  getCardClasses(): any {
    return {
      [this.card.suit]: true,
      'face-up': this.card.faceUp,
      'face-down': !this.card.faceUp
    };
  }
  
  getSuitSymbol(): string {
    switch (this.card.suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  }
  
  onDragStarted(): void {
    // Implement for drag functionality
  }
  
  onClick(): void {
    this.cardClick.emit(this.card);
  }
}

// File: components/pile/pile.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Card, Pile } from '../../solitaire-model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-pile',
  template: `
    <div class="pile"
         [ngClass]="{'empty': pile.cards.length === 0}"
         cdkDropList
         [cdkDropListData]="pile.cards"
         (cdkDropListDropped)="onCardDropped($event)">
      <div class="pile-placeholder" *ngIf="pile.cards.length === 0">
        {{placeholderText}}
      </div>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .pile {
      width: 110px;
      height: 150px;
      border: 2px dashed #ccc;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    
    .pile.empty {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .pile-placeholder {
      color: #999;
      text-align: center;
      font-size: 14px;
    }
  `]
})
export class PileComponent {
  @Input() pile!: Pile;
  @Input() placeholderText: string = '';
  @Output() cardDrop = new EventEmitter<CdkDragDrop<Card[]>>();
  
  onCardDropped(event: CdkDragDrop<Card[]>): void {
    this.cardDrop.emit(event);
  }
}

// File: components/tableau/tableau.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableauPile, Card } from '../../solitaire-model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tableau',
  template: `
    <app-pile [pile]="tableau" 
              placeholderText="Empty (Kings Only)"
              (cardDrop)="onCardDropped($event)">
      <div class="tableau-cards">
        <div *ngFor="let card of tableau.cards; let i = index" 
             class="tableau-card" 
             [style.top.px]="i * 25">
          <app-card [card]="card" 
                   [draggable]="card.faceUp"
                   (cardClick)="onCardClick(card, i)"></app-card>
        </div>
      </div>
    </app-pile>
  `,
  styles: [`
    .tableau-cards {
      position: relative;
      width: 100%;
      height: 100%;
    }
    
    .tableau-card {
      position: absolute;
      width: 100px;
    }
  `]
})
export class TableauComponent {
  @Input() tableau!: TableauPile;
  @Input() index!: number;
  @Output() cardDropped = new EventEmitter<any>();
  @Output() cardClicked = new EventEmitter<any>();
  
  onCardDropped(event: CdkDragDrop<Card[]>): void {
    this.cardDropped.emit({
      event,
      tableauIndex: this.index
    });
  }
  
  onCardClick(card: Card, index: number): void {
    if (!card.faceUp) return;
    
    this.cardClicked.emit({
      card,
      index,
      tableauIndex: this.index
    });
  }
}

// File: components/foundation/foundation.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FoundationPile, Card, Suit } from '../../solitaire-model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-foundation',
  template: `
    <app-pile [pile]="foundation" 
              [placeholderText]="getPlaceholderText()"
              (cardDrop)="onCardDropped($event)">
      <div class="foundation-cards">
        <div *ngIf="foundation.cards.length > 0">
          <app-card [card]="foundation.topCard!"
                   (cardClick)="onCardClick(foundation.topCard!)"></app-card>
        </div>
      </div>
    </app-pile>
  `,
  styles: [`
    .foundation-cards {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class FoundationComponent {
  @Input() foundation!: FoundationPile;
  @Input() index!: number;
  @Output() cardDropped = new EventEmitter<any>();
  @Output() cardClicked = new EventEmitter<any>();
  
  getPlaceholderText(): string {
    switch (this.foundation.suit) {
      case Suit.HEARTS: return '♥ A';
      case Suit.DIAMONDS: return '♦ A';
      case Suit.CLUBS: return '♣ A';
      case Suit.SPADES: return '♠ A';
      default: return '';
    }
  }
  
  onCardDropped(event: CdkDragDrop<Card[]>): void {
    this.cardDropped.emit({
      event,
      foundationIndex: this.index
    });
  }
  
  onCardClick(card: Card): void {
    this.cardClicked.emit({
      card,
      foundationIndex: this.index
    });
  }
}

// File: components/stock/stock.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { StockPile } from '../../solitaire-model';

@Component({
  selector: 'app-stock',
  template: `
    <div class="stock" (click)="onStockClick()">
      <div class="stock-cards" *ngIf="stock.cards.length > 0">
        <div class="card card-back">
          <div class="card-pattern"></div>
        </div>
      </div>
      <div class="stock-placeholder" *ngIf="stock.cards.length === 0">
        <span class="reset-icon">↻</span>
      </div>
    </div>
  `,
  styles: [`
    .stock {
      width: 110px;
      height: 150px;
      border: 2px dashed #ccc;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    
    .stock-cards {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .card-back {
      width: 100px;
      height: 140px;
      background-color: #2c3e50;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .card-pattern {
      width: 80%;
      height: 80%;
      background: repeating-linear-gradient(
        45deg,
        #34495e,
        #34495e 10px,
        #2c3e50 10px,
        #2c3e50 20px
      );
    }
    
    .stock-placeholder {
      color: #999;
      font-size: 24px;
      text-align: center;
    }
    
    .reset-icon {
      font-size: 36px;
    }
  `]
})
export class StockComponent {
  @Input() stock!: StockPile;
  @Output() stockClick = new EventEmitter<void>();
  
  onStockClick(): void {
    this.stockClick.emit();
  }
}

// File: components/waste/waste.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WastePile, Card } from '../../solitaire-model';

@Component({
  selector: 'app-waste',
  template: `
    <app-pile [pile]="waste" placeholderText="Waste">
      <div class="waste-cards">
        <div *ngIf="waste.cards.length > 0">
          <app-card [card]="waste.topCard!"
                   (cardClick)="onCardClick(waste.topCard!)"></app-card>
        </div>
      </div>
    </app-pile>
  `,
  styles: [`
    .waste-cards {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class WasteComponent {
  @Input() waste!: WastePile;
  @Output() cardClicked = new EventEmitter<Card>();
  
  onCardClick(card: Card): void {
    this.cardClicked.emit(card);
  }
}

// File: components/game-board/game-board.component.ts
import { Component, OnInit } from '@angular/core';
import { SolitaireGame, Card } from '../../solitaire-model';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-game-board',
  template: `
    <div class="game-controls">
      <button (click)="newGame()">New Game</button>
      <div class="score">Moves: {{moves}}</div>
    </div>
    
    <div class="game-board">
      <div class="top-row">
        <div class="stock-waste">
          <app-stock [stock]="game.stock" (stockClick)="onStockClick()"></app-stock>
          <app-waste [waste]="game.waste" (cardClicked)="onWasteCardClick($event)"></app-waste>
        </div>
        
        <div class="foundations">
          <app-foundation *ngFor="let foundation of game.foundations; let i = index"
                         [foundation]="foundation"
                         [index]="i"
                         (cardDropped)="  onFoundationDrop($event)"
                         (cardClicked)="onFoundationCardClick($event)"></app-foundation>
        </div>
      </div>
      
      <div class="tableaus">
        <app-tableau *ngFor="let tableau of game.tableaus; let i = index"
                    [tableau]="tableau"
                    [index]="i"
                    (cardDropped)="onTableauDrop($event)"
                    (cardClicked)="onTableauCardClick($event)"></app-tableau>
      </div>
    </div>
    
    <div class="win-message" *ngIf="isGameWon">
      <h2>Congratulations!</h2>
      <p>You've completed the game in {{moves}} moves!</p>
      <button (click)="newGame()">Play Again</button>
    </div>
  `,
  styles: [`
    .game-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    button {
      padding: 10px 20px;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }
    
    button:hover {
      background-color: #2980b9;
    }
    
    .score {
      font-size: 18px;
      font-weight: bold;
    }
    
    .game-board {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .top-row {
      display: flex;
      justify-content: space-between;
    }
    
    .stock-waste {
      display: flex;
      gap: 20px;
    }
    
    .foundations {
      display: flex;
      gap: 10px;
    }
    
    .tableaus {
      display: flex;
      gap: 10px;
      justify-content: space-between;
    }
    
    .win-message {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      text-align: center;
    }
  `]
})
export class GameBoardComponent implements OnInit {
  game: SolitaireGame;
  moves: number = 0;
  isGameWon: boolean = false;
  draggedCards: Card[] = [];
  dragSource: { type: string, index: number } | null = null;
  
  constructor() {
    this.game = new SolitaireGame();
  }
  
  ngOnInit(): void {
    this.newGame();
  }
  
  newGame(): void {
    this.game.initialize();
    this.moves = 0;
    this.isGameWon = false;
  }
  
  onStockClick(): void {
    this.game.drawFromStock();
    this.moves++;
  }
  
  onWasteCardClick(card: Card): void {
    // Try to move to foundation first
    const foundationMoved = this.game.moveCardToFoundation(card, 'waste', 0);
    if (foundationMoved) {
      this.moves++;
      this.checkWin();
      return;
    }
    
    // Find valid tableau
    for (let i = 0; i < this.game.tableaus.length; i++) {
      if (this.game.tableaus[i].canAddCard(card)) {
        this.game.moveCardToTableau(card, [card], 'waste', 0, i);
        this.moves++;
        return;
      }
    }
  }
  
  onFoundationCardClick(event: any): void {
    const { card, foundationIndex } = event;
    
    // Find valid tableau
    for (let i = 0; i < this.game.tableaus.length; i++) {
      if (this.game.tableaus[i].canAddCard(card)) {
        this.game.moveCardToTableau(card, [card], 'foundation', foundationIndex, i);
        this.moves++;
        return;
      }
    }
  }
  
  onTableauCardClick(event: any): void {
    const { card, index, tableauIndex } = event;
    
    // Only auto-move top cards
    if (index !== this.game.tableaus[tableauIndex].cards.length - 1) {
      return;
    }
    
    // Try to move to foundation first
    const foundationMoved = this.game.moveCardToFoundation(card, 'tableau', tableauIndex);
    if (foundationMoved) {
      this.moves++;
      this.checkWin();
      return;
    }
  }