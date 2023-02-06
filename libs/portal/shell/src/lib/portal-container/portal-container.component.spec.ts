import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalContainerComponent } from './portal-container.component';
import { MaterialDependenciesModule } from '../material-dependencies.module';

describe('PortalContainerComponent', () => {
  let component: PortalContainerComponent;
  let fixture: ComponentFixture<PortalContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortalContainerComponent],
      imports: [MaterialDependenciesModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PortalContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
