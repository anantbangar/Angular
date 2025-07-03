import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Email } from './components/email/email';
import { Home } from './components/home/home';

const routes: Routes = [
  {
    path: 'composeEmail',
    component: Email,
    pathMatch: 'full'
  },

  {
    path: '',
    component: Home,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
