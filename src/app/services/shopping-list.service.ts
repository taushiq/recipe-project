import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  private ingredients: Ingredient[] = [
    // new Ingredient('Apples', 5),
    // new Ingredient('Tomatoes', 10)
  ];

  // ingredientsSubscription = new EventEmitter<Ingredient[]>();
  ingredientsSubscription = new Subject<Ingredient[]>();
  onStartedEditing = new Subject<number>();


  constructor() { }

  getIngredients(){
    return this.ingredients.slice();
  }

  getIngredient(index: number){
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient){
    this.ingredients.push(ingredient);
    // this.ingredientsSubscription.emit(this.ingredients.slice());
    this.ingredientsSubscription.next(this.ingredients.slice());
  }

  updateIngredient(index: number , newIngredient: Ingredient){
    this.ingredients[index] = newIngredient;
    this.ingredientsSubscription.next(this.ingredients.slice());
  }

  deleteIngredient(index: number){
    this.ingredients.splice(index , 1);
    this.ingredientsSubscription.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]){
    this.ingredients.push(...ingredients);
    // this.ingredientsSubscription.emit(this.ingredients.slice());
    this.ingredientsSubscription.next(this.ingredients.slice());
  }


}
