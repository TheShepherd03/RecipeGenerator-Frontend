import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './edit-recipe.component.html',
  styles: [`
    .edit-recipe-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
    }

    .recipe-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .full-width {
      width: 100%;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .ingredients-list,
    .instructions-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .ingredient-item,
    .instruction-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .ingredient-item mat-form-field,
    .instruction-item mat-form-field {
      flex: 1;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    h1 {
      color: #2D3748;
      margin-bottom: 1.5rem;
    }

    h2 {
      color: #4A5568;
      margin-bottom: 0.5rem;
    }

    .loading,
    .error {
      text-align: center;
      padding: 2rem;
    }

    .error {
      color: #E53E3E;
    }
  `]
})
export class EditRecipeComponent implements OnInit {
  recipeForm: FormGroup;
  isLoading = true;
  error: string | null = null;
  recipeId: string;

  difficultyLevels = ['Easy', 'Medium', 'Hard'];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.recipeId = this.route.snapshot.params['id'];
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      imageUrl: [''],
      cookingTime: ['', [Validators.required, Validators.min(1)]],
      servings: ['', [Validators.required, Validators.min(1)]],
      difficulty: ['', Validators.required],
      ingredients: this.fb.array([]),
      instructions: this.fb.array([])
    });
  }

  ngOnInit() {
    if (this.recipeId) {
      this.loadRecipe();
    }
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions() {
    return this.recipeForm.get('instructions') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(this.fb.control('', Validators.required));
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  addInstruction() {
    this.instructions.push(this.fb.control('', Validators.required));
  }

  removeInstruction(index: number) {
    this.instructions.removeAt(index);
  }

  private loadRecipe() {
    this.isLoading = true;
    this.error = null;

    this.recipeService.getRecipeById(this.recipeId).subscribe({
      next: (recipe: Recipe) => {
        // Clear existing arrays
        while (this.ingredients.length) {
          this.ingredients.removeAt(0);
        }
        while (this.instructions.length) {
          this.instructions.removeAt(0);
        }

        // Add ingredients
        recipe.ingredients.forEach(ingredient => {
          this.ingredients.push(this.fb.control(ingredient));
        });

        // Add instructions
        recipe.instructions.forEach(instruction => {
          this.instructions.push(this.fb.control(instruction));
        });
        console.log('recipe {} : ',recipe)
        // Update other fields
        this.recipeForm.patchValue({
          name: recipe.name,
          imageUrl: recipe.imageUrl || 'https://via.placeholder.com/400x300',
          cookingTime: recipe.cookingTime,
          servings: recipe.servings,
          difficulty: recipe.difficulty
        });

        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load recipe';
        this.isLoading = false;
        console.error('Error loading recipe:', error);
      }
    });
  }

  onSubmit() {
    if (this.recipeForm.valid && this.recipeId) {
      const updatedRecipe = {
        ...this.recipeForm.value,
        imageUrl: this.recipeForm.value.imageUrl || 'https://via.placeholder.com/400x300'
      };

      this.recipeService.updateRecipe(this.recipeId, updatedRecipe).subscribe({
        next: () => {
          this.router.navigate(['/recipe', this.recipeId]);
        },
        error: (error: any) => {
          this.error = 'Failed to update recipe';
          console.error('Error updating recipe:', error);
        }
      });
    }
  }
}
