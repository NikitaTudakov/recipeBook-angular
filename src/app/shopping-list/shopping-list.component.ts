import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import * as shoppingListActions from './store/shopping-list.action';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ingredients: Ingredient[]}>;
  private subscription: Subscription;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.shoppingListService.getIngredients()
    // this.subscription = this.shoppingListService.ingrediendsChanges
    //   .subscribe(
    //     (ingredientsChanges: Ingredient[]) => {
    //       this.ingredients = ingredientsChanges
    //     }
    //   );
  }

  onEdit(id: number) {
    // this.shoppingListService.startedEditing.next(id)
    this.store.dispatch(new shoppingListActions.StartEdit(id))
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
