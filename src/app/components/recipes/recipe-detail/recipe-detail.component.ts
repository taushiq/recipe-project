import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];   // + sign to cast the string to a number
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    );

    // this.route.data.subscribe(
    //   (params: Params) => {
    //     this.id = +params['id'];   // + sign to cast the string to a number
    //     this.recipe = this.recipeService.getRecipe(this.id);
    //   }
    // );
  }

  toShoppingList(){
    this.recipeService.toShoppingListService(this.recipe.ingredients);
  }

  editRecipe(){
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.id , 'edit'], { relativeTo: this.route });
  }

  onDelete(){
    this.recipeService.deleteRecipe(this.id);
  }

}
