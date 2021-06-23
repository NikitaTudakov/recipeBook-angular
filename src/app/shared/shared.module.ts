import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.components";
import { DropDownDirective } from "./dropDown.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { Placeholder } from "./placeholder/placeholder.directive";

@NgModule({
  declarations: [
    DropDownDirective,
    LoadingSpinnerComponent,
    AlertComponent,
    Placeholder
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DropDownDirective,
    LoadingSpinnerComponent,
    AlertComponent,
    Placeholder,
    CommonModule,
  ]
})
export class SharedModulue{}