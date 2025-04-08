import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { GameComponent } from "./game/game.component";
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, GameComponent, HeaderComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "ngtaire";
}
