import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { exhaustMap, map, tap , take} from 'rxjs/operators';

import { RecipeService } from './recipe.service';
import { Recipe } from '../models/recipe.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

  //We will add the token with the help of HttpInterceptors
  storeRecipes(){
    const recipes = this.recipeService.getRecipes();
    //Firebase syntax
    return this.http.put('https://recipebook-05.firebaseio.com/recipes.json', recipes);
  }


  
  fetchRecipes(){
    
      return this.http.get<Recipe[]>('https://recipebook-05.firebaseio.com/recipes.json', 
      
      ).pipe(map(recipes => {
      return recipes.map(recipe => {
        return { ...recipe, ingredient: recipe.ingredients? recipe.ingredients : []
         };
      });
    }),
      tap( recipes => {
        this.recipeService.setRecipes(recipes);
      }))
    
  }


}
