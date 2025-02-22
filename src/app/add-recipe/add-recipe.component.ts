import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-add-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-recipe.component.html'
})
export class AddRecipeComponent {
  recipe: Partial<Recipe> = {
    name: '',
    ingredients: [],
    instructions: [],
    cookingTime: 30,
    servings: 4,
    difficulty: 'Medium',
    imageUrl: ''
  };

  currentIngredient: string = '';
  currentInstruction: string = '';
  isSubmitting = false;

  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) {}

  addIngredient() {
    if (this.currentIngredient.trim()) {
      this.recipe.ingredients = [...(this.recipe.ingredients || []), this.currentIngredient.trim()];
      this.currentIngredient = '';
    }
  }

  removeIngredient(index: number) {
    this.recipe.ingredients = this.recipe.ingredients?.filter((_, i) => i !== index) || [];
  }

  addInstruction() {
    if (this.currentInstruction.trim()) {
      this.recipe.instructions = [...(this.recipe.instructions || []), this.currentInstruction.trim()];
      this.currentInstruction = '';
    }
  }

  removeInstruction(index: number) {
    this.recipe.instructions = this.recipe.instructions?.filter((_, i) => i !== index) || [];
  }

  onSubmit() {
    if (this.isSubmitting) return;
    
    if (!this.recipe.imageUrl) {
      this.recipe.imageUrl = 'https://via.placeholder.com/400x300';
    }
    
    this.isSubmitting = true;
    this.recipeService.addRecipe(this.recipe as Recipe).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error adding recipe:', error);
        this.isSubmitting = false;
      }
    });
  }
}
