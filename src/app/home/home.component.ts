import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { NavigationComponent } from '../navigation/navigation.component';
import { SearchRecipesComponent } from '../search-recipes/search-recipes.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavigationComponent, SearchRecipesComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  recipes: Recipe[] = [];
  suggestedRecipes: Recipe[] = [];
  searchQuery: string = '';
  isLoading = false;

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
  }

  

  
  
}
