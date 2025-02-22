import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  suggestedRecipes: Recipe[] = [];
  allRecipes: Recipe[] = [];
  searchQuery: string = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        // For demo purposes, split recipes between suggested and all
        this.suggestedRecipes = recipes.slice(0, 3);
        this.allRecipes = recipes;
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
      }
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.recipeService.searchRecipes(this.searchQuery).subscribe({
        next: (recipes) => {
          this.allRecipes = recipes;
        },
        error: (error) => {
          console.error('Error searching recipes:', error);
        }
      });
    } else {
      this.loadRecipes();
    }
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'https://via.placeholder.com/400x300';
    }
  }
}
