import { Component } from "@angular/core";
import { PileComponent } from "../pile/pile.component";

@Component({
  selector: "app-game",
  imports: [PileComponent],
  templateUrl: "./game.component.html",
  styleUrl: "./game.component.css",
})
export class GameComponent {}
