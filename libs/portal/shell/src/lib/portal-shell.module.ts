import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { PortalContainerComponent } from './portal-container/portal-container.component';

const appRoutes: Route[] = [
  {
    path: '',
    component: PortalContainerComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
  ],
  declarations: [PortalContainerComponent],
})
export class PortalShellModule {}
