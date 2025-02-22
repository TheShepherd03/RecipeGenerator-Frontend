import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  recipe: Recipe | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadRecipe(id);
      }
    });
  }

  private loadRecipe(id: string) {
    this.isLoading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        if (typeof recipe.instructions === 'string') {
          recipe.instructions = this.formatInstructions(recipe.instructions);
        }
        this.recipe = recipe;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load recipe';
        this.isLoading = false;
        console.error('Error loading recipe:', error);
      }
    });
  }

  editRecipe() {
    if (this.recipe?._id) {
      this.router.navigate(['/recipe', this.recipe._id, 'edit']);
    }
  }

  deleteRecipe() {
    if (!this.recipe?._id) return;

    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '300px',
      data: { recipeName: this.recipe.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.recipeService.deleteRecipe(this.recipe!._id!).subscribe({
          next: () => {
            this.snackBar.open('Recipe deleted successfully', 'Close', {
              duration: 3000
            });
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.snackBar.open('Failed to delete recipe', 'Close', {
              duration: 3000
            });
            console.error('Error deleting recipe:', error);
          }
        });
      }
    });
  }

  private formatInstructions(instructions: string): string[] {
    return instructions.split('\n').filter(instruction => instruction.trim());
  }
}

@Component({
  selector: 'delete-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Delete Recipe</h2>
    <mat-dialog-content>
      Are you sure you want to delete "{{data.recipeName}}"?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button color="warn" [mat-dialog-close]="true">Delete</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class DeleteConfirmationDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { recipeName: string }) {}
}
