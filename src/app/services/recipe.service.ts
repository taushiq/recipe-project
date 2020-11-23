import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';
import { Recipe } from '../models/recipe.model';
import { ShoppingListService } from './shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  // recipeSelected = new EventEmitter<Recipe>();
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe('A Big Fat Burger', 'A super tasty Burger - Just Awesome', 'https://lh3.googleusercontent.com/proxy/M7JZovM44DdEEwvuZM9ZGxPyyVsB306D-78Bisi7242InPflk44E3r3mp49eLW6XLywUOFhBtbHnlxnO67_9K9fDLjERHE4F0wE9rgIabobcpasg2yxRaFACzzuuuw',
  //    [
  //      new Ingredient('Buns', 2), new Ingredient('Chicken', 1)
  //    ]),
  //   new Recipe('Tasty Chocolate Cake', 'Guide to making your own Chocolate Cake', 'https://www.kindpng.com/picc/m/40-409952_chocolate-cake-download-free-png-best-cakes-png.png', 
  //   [
  //     new Ingredient('Flour', 1), new Ingredient('Chocolate', 10)
  //   ])
  // ];

  private recipes: Recipe[] = [];
  
  constructor(private router: Router, private slService: ShoppingListService) { }

  getRecipes(){
    return this.recipes.slice();
  }

  getRecipe(index: number){
    return this.recipes.slice()[index];
  }

  toShoppingListService(ingredients: Ingredient[]){
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe){
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number){
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
    this.router.navigate(['/recipes']);
  }

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

}
