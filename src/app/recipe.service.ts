import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Recipe, DetailedRecipe, PaginatedResponse, PaginatedApiResponse } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000/api/recipes';
  //private apiUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php';

  constructor(private http: HttpClient) {}

  private processRecipe(recipe: any): Recipe {
    return {
      ...recipe,
      cookingTime: Math.floor(Math.random() * 30) + 15,
      ingredients: recipe.ingredients || []
    };
  }

  getRecipes(page: number = 1, pageSize: number = 10): Observable<PaginatedApiResponse<Recipe>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedApiResponse<Recipe>>(this.apiUrl, { params }).pipe(
      map(response => ({
        success: true,
        data: {
          items: response.data?.items.map(recipe => this.processRecipe(recipe)) || [],
          total: response.data?.total || 0,
          page: response.data?.page || page,
          pageSize: response.data?.pageSize || pageSize,
          totalPages: response.data?.totalPages || 0
        },
        statusCode: 200
      })),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => ({
          success: false,
          data: {
            items: [],
            total: 0,
            page,
            pageSize,
            totalPages: 0
          },
          statusCode: error.status || 500,
          message: error.message || 'An error occurred while fetching recipes'
        }));
      })
    );
  }

  getRecipeById(id: string): Observable<DetailedRecipe | null> {
    return this.http.get<DetailedRecipe>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching recipe:', error);
        return of(null);
      })
    );
  }

  searchRecipes(query: string): Observable<Recipe[]> {
    const params = new HttpParams().set('ingredient', query);
    
    return this.http.get<Recipe[]>(`${this.apiUrl}/search`, { params })
      
  }
}
