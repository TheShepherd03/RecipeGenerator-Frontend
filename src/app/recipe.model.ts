export interface Recipe {
  _id?: string;
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  difficulty: string;
  imageUrl: string;
}