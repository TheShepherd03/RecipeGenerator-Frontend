import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'https://recipegenerator-production-ba58.up.railway.app/recipes'; // Update with your backend API URL

  constructor(private http: HttpClient) {}

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipe);
  }

  updateRecipe(id: string, recipe: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, recipe);
  }

  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchRecipes(query: string): Observable<Recipe[]> {
    const params = new HttpParams().set('ingredients', query);
    return this.http.get<Recipe[]>(`${this.apiUrl}/search`, { params });
  }

  searchByIngredients(ingredients: string[]): Observable<Recipe[]> {
    const params = new HttpParams().set('ingredients', ingredients.join(','));
    return this.http.get<Recipe[]>(`${this.apiUrl}/search`, { params });
  }
}
