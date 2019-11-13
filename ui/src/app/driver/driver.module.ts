import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LibraryModule } from '../library.module';
import { DriverComponent } from './driver/driver.component';

@NgModule({
  declarations: [DriverComponent],
  imports: [
    LibraryModule,
    RouterModule.forChild([
      { path: '', component: DriverComponent }
    ]),
    CommonModule
  ]
})
export class DriverModule { }
