import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: '[appPlaceholder]'
})
export class Placeholder {
  constructor (public viewContainerRef: ViewContainerRef) {
    
  }
}