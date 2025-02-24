import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DetailedRecipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [CommonModule, RouterModule, NavigationComponent],
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  recipe: DetailedRecipe | null = null;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recipeService.getRecipeById(id).subscribe(
        recipe => this.recipe = recipe,
        error => console.error('Error fetching recipe:', error)
      );
    }
  }

  getInstructionSteps(): string[] {
    if (!this.recipe?.strInstructions) return [];
    return this.recipe.strInstructions
      .split(/\r\n|\n|\r/)
      .filter(step => step.trim().length > 0);
  }
}
