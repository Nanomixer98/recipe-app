import { RecipeService } from './../../services/recipe.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public recipeService: RecipeService) { }

  ngOnInit(
  ) {
    
    console.log(this.recipeService.getRecipes());
  }

}
