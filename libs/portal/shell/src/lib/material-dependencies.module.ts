import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const MATERIAL_MODULES = [MatCardModule, MatButtonModule, MatIconModule];

@NgModule({
  imports: [MATERIAL_MODULES],
  exports: [MATERIAL_MODULES],
})
export class MaterialDependenciesModule {}
