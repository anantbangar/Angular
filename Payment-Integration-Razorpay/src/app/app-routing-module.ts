import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Donation } from './components/donation/donation';

const routes: Routes = [
  {
    path: '',
    component: Donation,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
