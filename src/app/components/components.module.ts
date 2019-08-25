import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LibraryModule } from '../library.module';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LibraryModule
  ],
  declarations: [],
  exports: []
})
export class ComponentsModule { }
