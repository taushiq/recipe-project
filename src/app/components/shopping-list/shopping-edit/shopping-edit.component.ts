import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/models/ingredient.model';
import { ShoppingListService } from 'src/app/services/shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  // @ViewChild('name', { static: false }) nameInputRef: ElementRef;
  // @ViewChild('amount', { static: false }) amountInputRef: ElementRef;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedIngredient: Ingredient;
  @ViewChild('f' , { static: false }) myForm: NgForm;

  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.slService.onStartedEditing
    .subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedIngredient = this.slService.getIngredient(index);
        this.myForm.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        });
      }
    );
  }

  onSubmit(form: NgForm): void{
    const value = form.value;
    // const name = this.nameInputRef.nativeElement.value;
    // const amount = this.amountInputRef.nativeElement.value;
    let ingredient = new Ingredient(value.name , value.amount)
    if(this.editMode){
      this.slService.updateIngredient(this.editedItemIndex , ingredient);
    }else{
      this.slService.addIngredient(ingredient);
    }
    this.editMode = false;
    form.reset();
  }

  onClear(){
    this.editMode = false;
    this.myForm.reset();
  }

  onDelete(){
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }


}
