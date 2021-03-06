import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Recipe } from '../models/recipe.model';
import { DataStorageService } from '../services/data-storage.service';
import { RecipeService } from '../services/recipe.service';

@Injectable({
    providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {

    constructor(private dataStorage: DataStorageService, private recipeService: RecipeService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        const recipes = this.recipeService.getRecipes();

        if(recipes.length == 0){
            return this.dataStorage.fetchRecipes();
        }else{
            return;
        }
        
    }

}