import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Recipe, DetailedRecipe,  PaginatedResponse, PaginatedApiResponse } from './recipe.model';
import { ErrorHandler } from './utils/error-handler';
import { IngredientUtil } from './utils/ingredient.util';
import { CacheService } from './services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000/recipes';

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  private processRecipe(recipe: any): Recipe {
    return {
      ...recipe,
      cookingTime: Math.floor(Math.random() * 30) + 15,
      ingredients: IngredientUtil.extractIngredients(recipe)
    };
  }

  getRecipes(page: number = 1, pageSize: number = 10): Observable<PaginatedApiResponse<Recipe>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedApiResponse<Recipe>>(this.apiUrl, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = ErrorHandler.handleError(error);
        const statusCode = ErrorHandler.getStatusCode(error);
        return throwError(() => ({
          success: false,
          error: errorMessage,
          statusCode,
          message: errorMessage
        }));
      })
    );
  }

  getRecipeById(id: string): Observable<DetailedRecipe> {
    const cacheKey = `recipe_${id}`;
    const cachedRecipe = this.cacheService.get<DetailedRecipe>(cacheKey);
    if (cachedRecipe) {
      return of(cachedRecipe);
    }

    return this.http.get<DetailedRecipe>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (!response) {
          throw new Error('Recipe not found');
        }
        this.cacheService.set(cacheKey, response);
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = ErrorHandler.handleError(error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipe).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = ErrorHandler.handleError(error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  updateRecipe(id: string, recipe: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, recipe).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = ErrorHandler.handleError(error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = ErrorHandler.handleError(error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  searchRecipes(searchTerm: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search?ingredient=${encodeURIComponent(searchTerm)}`).pipe(
      map(response => {
        console.log('Raw API Response:', response);
        return response || [];
      }),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = ErrorHandler.handleError(error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  searchByIngredients(ingredients: string[]): Observable<Recipe[]> {
    const params = new HttpParams().set('ingredients', ingredients.join(','));
    return this.http.get<Recipe[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = ErrorHandler.handleError(error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getRandomRecipes(): Observable<Recipe[]> {
    return this.http.get<any>(`${this.apiUrl}/random`)
      .pipe(
        map(response => (response.meals || [])),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = ErrorHandler.handleError(error);
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
