import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { Recipe } from '../../../models/recipe.model';
import { RecipeService } from '../../../../app/services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/services/data-storage.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  subscription: Subscription;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router, private dataStorage: DataStorageService) { }

  ngOnInit(): void {
    if(!this.recipes){
      this.dataStorage.fetchRecipes().subscribe();
      this.recipes = this.recipeService.getRecipes();
    }
    this.subscription = this.recipeService.recipesChanged
    .subscribe(
      (recipes: Recipe[])=>{
        this.recipes = recipes;
      }
    );
    this.recipes = this.recipeService.getRecipes();
  }

  addRecipe(){
    this.router.navigate(['new'], { relativeTo : this.route });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
