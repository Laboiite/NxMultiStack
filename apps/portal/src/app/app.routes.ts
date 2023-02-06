import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'portal',
  },
  {
    path: 'portal',
    loadChildren: () =>
      import('@nxmultistack/portal/shell').then((m) => m.PortalShellModule),
  },
];
