import { Component } from '@angular/core';

@Component({
  selector: 'portal-portal-container',
  templateUrl: './portal-container.component.html',
  styleUrls: ['./portal-container.component.scss'],
})
export class PortalContainerComponent {
  // Model for app to be defined in the next iteration
  public apps: any[] = [
    {
      title: 'First app title',
      subtitle: 'First app subtitle',
    },
    {
      title: 'Second app title',
      subtitle: 'Second app subtitle',
    },
    {
      title: 'Third app title',
      subtitle: 'Third app subtitle',
    },
  ];
}
