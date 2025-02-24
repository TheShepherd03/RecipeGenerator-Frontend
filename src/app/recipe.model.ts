export interface Ingredient {
  ingredient: string;
  measure: string;
}

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
  strTags?: string;
  cookingTime: number;
  ingredients: Ingredient[];
}

export interface DetailedRecipe extends Recipe {
  strInstructions: string;
  strYoutube?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedApiResponse<T> extends ApiResponse<PaginatedResponse<T>> {}