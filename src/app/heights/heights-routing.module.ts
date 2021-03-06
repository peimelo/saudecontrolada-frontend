import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { HeightsPageComponent } from './containers/heights-page/heights-page.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: HeightsPageComponent,
    data: { title: 'Heights' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeightsRoutingModule {}
