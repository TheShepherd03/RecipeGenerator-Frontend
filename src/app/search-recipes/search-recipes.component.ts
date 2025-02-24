import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-search-recipes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './search-recipes.component.html',
  styleUrls: ['./search-recipes.component.css']
})
export class SearchRecipesComponent implements OnInit {
  searchTerm: string = '';
  recipes: any[] = [];
  suggestedRecipes = [
    {
      idMeal: '52854',
      strMeal: 'Pancakes',
      strMealThumb: "https://www.themealdb.com/images/media/meals/rwuyqx1511383174.jpg"
    },
    {
      idMeal: '52844',
      strMeal: 'Lasagne',
      strMealThumb: "https://www.themealdb.com/images/media/meals/wtsvxx1511296896.jpg"
    },
    {
      idMeal: '52935',
      strMeal: 'Steak',
      strMealThumb: "https://www.themealdb.com/images/media/meals/vussxq1511882648.jpg"
    }
  ];

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    // We don't load random recipes initially anymore
  }

  searchRecipes() {
    if (this.searchTerm.trim()) {
      this.recipeService.searchRecipes(this.searchTerm).subscribe(
        (data: any) => {
          console.log('Component received data:', data);
          this.recipes = data || [];
          console.log('Processed recipes:', this.recipes);
        },
        error => {
          console.error('Error searching recipes:', error);
        }
      );
    } else {
      this.recipes = [];
    }
  }
}
