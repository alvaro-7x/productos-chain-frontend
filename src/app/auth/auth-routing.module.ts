import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './paginas/login/login.component';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'login',
      pathMatch: 'full',
      component: LoginComponent
    },
    {
      path: '**',
      redirectTo: 'login'
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule
{ }
