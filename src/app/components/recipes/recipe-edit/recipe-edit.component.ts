import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/guards/can-deactivate-guard.service';
import { Recipe } from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, CanComponentDeactivate {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  changesSaved = false;
  recipeName = '';
  recipeImagePath = '';
  recipeDescription = '';
  recipeIngredients = new FormArray([]);

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );
  }


  onSubmit(){
    let recipe = new Recipe(this.recipeForm.value.name , this.recipeForm.value.description, this.recipeForm.value.imagePath,
      this.recipeForm.value.ingredients);
    if(this.editMode){
      this.recipeService.updateRecipe(this.id, recipe);
    }else{
      this.recipeService.addRecipe(recipe);
    }
    this.changesSaved = true;
    this.onCancel();
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteIngredient(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  private initForm(){
    // let recipeName = '';
    // let recipeImagePath = '';
    // let recipeDescription = '';
    // let recipeIngredients = new FormArray([]);

    if(this.editMode){
      const recipe = this.recipeService.getRecipe(this.id);
      this.recipeName = recipe.name;
      this.recipeImagePath = recipe.imagePath;
      this.recipeDescription = recipe.description;
      if(recipe['ingredients']){
        for (let ingredient of recipe.ingredients){
          this.recipeIngredients.push(
            new FormGroup({
              'name' : new FormControl(ingredient.name, Validators.required),
              'amount' : new FormControl(ingredient.amount , [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          );
        }
        
      }
    }

    this.recipeForm = new FormGroup({
      'name' : new FormControl(this.recipeName, Validators.required),
      'imagePath' : new FormControl(this.recipeImagePath, Validators.required),
      'description' : new FormControl(this.recipeDescription, Validators.required),
      'ingredients': this.recipeIngredients
    });
  }

  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  addIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null , [Validators.required , Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean{
    if(!this.editMode){
      return true;
    }else{
      if((this.recipeForm.value.name !== this.recipeName || this.recipeForm.value.description !== this.recipeDescription || this.recipeForm.value.imagePath !== this.recipeImagePath) && !this.changesSaved){
        return Swal.fire({
          title: 'Do you want to discard the changes?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'red',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, I want to discard'
        }).then((result) => {
          if (result.isConfirmed) {
            console.log("Working");
            return true;
          }
        })
      }else{
        return true;
      }
    }
    
  }

}
