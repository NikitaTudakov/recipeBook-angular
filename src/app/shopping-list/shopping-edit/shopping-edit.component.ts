import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as shoppingListActions from '../store/shopping-list.action';
import * as fromApp from '../../store/app.reducer';
import { Ingredient } from '../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f',{static:false}) shoplistForm: NgForm;
  shoppingSuscription: Subscription;
  EditMode = false;
  itemIndex: number;
  editedItem: Ingredient;

  constructor(
    private store: Store<fromApp.AppState>,
  ) { }

  ngOnInit(): void {
    this.shoppingSuscription = this.store.select('shoppingList')
    .subscribe(storeData => {
      if(storeData.editedIngredientIndex > -1) {
        this.EditMode = true;
        this.itemIndex = storeData.editedIngredientIndex
        this.editedItem = storeData.editedIngredient;
        this.shoplistForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        })
      } else {
        this.EditMode = false;
      }
    })
  }

  ngOnDestroy() {
    this.shoppingSuscription.unsubscribe()
    this.store.dispatch(new shoppingListActions.StopEdit())
  }

  onSubmit(form: NgForm) {
    const value = form.value
    const ingredient = new Ingredient(value.name, value.amount);
    if(this.EditMode) {
      // this.shoppingListService.updateIngredient(this.itemIndex, ingredient)
      this.store.dispatch( new shoppingListActions.UpdateIngredient(ingredient))
    } else {
      this.store.dispatch(new shoppingListActions.AddIngredient(ingredient))
      // this.shoppingListService.addIngredient(ingredient)
    }
    this.EditMode = false;
    form.reset();
  }

  onClear() {
    this.shoplistForm.reset();
    this.EditMode = false;
    this.store.dispatch(new shoppingListActions.StopEdit())
  }

  onDelete() {
    this.onClear();
    this.store.dispatch( new shoppingListActions.DeleteIngredient())
    // this.shoppingListService.deleteIngredient(this.itemIndex);
  }
}
