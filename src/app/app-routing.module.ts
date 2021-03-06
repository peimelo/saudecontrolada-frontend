import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './core/containers/home/home-page.component';
import { NotFoundPageComponent } from './core/containers/not-found-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    data: { title: 'Home' },
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'heights',
    loadChildren: () =>
      import('./heights/heights.module').then((m) => m.HeightsModule),
  },
  {
    path: 'results',
    loadChildren: () =>
      import('./results/results.module').then((m) => m.ResultsModule),
  },
  {
    path: 'weights',
    loadChildren: () =>
      import('./weights/weights.module').then((m) => m.WeightsModule),
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    data: { title: 'Page Not found' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
