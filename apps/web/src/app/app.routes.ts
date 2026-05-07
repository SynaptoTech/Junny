import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then(
        (m) => m.LandingPageComponent,
      ),
  },
  // Futuros: /docs, /app, /settings — lazy routes dedicadas.
];
