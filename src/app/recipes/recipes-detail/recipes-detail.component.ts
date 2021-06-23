import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as shoppingListActions from '../../shopping-list/store/shopping-list.action';
import * as fromApp from '../../store/app.reducer';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipes-detail',
  templateUrl: './recipes-detail.component.html',
  styleUrls: ['./recipes-detail.component.scss']
})
export class RecipesDetailComponent implements OnInit {
  recivedRecipe: Recipe;
  id: number;

  constructor(
    private recipeServices: RecipesService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.recivedRecipe = this.recipeServices.getRecipe(this.id)
        }
      )
  }

  addToShoppingList() {
    // this.recipeServices.addIngredients(this.recivedRecipe.ingredients)
    this.store.dispatch( new shoppingListActions.AddIngredients(this.recivedRecipe.ingredients))
  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.route})
  }

  onDelete() {
    this.recipeServices.deleteRecipe(this.id)
    this.router.navigate(['recipes'])
  }
}
