import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModulue } from "../shared/shared.module";
import { AuthComponent } from "./auth.component";

@NgModule({
  declarations: [AuthComponent],
  imports: [
    SharedModulue,
    FormsModule,
    RouterModule.forChild([
      {path: '',component: AuthComponent }
    ])
  ]
})
export class AuthModule{}