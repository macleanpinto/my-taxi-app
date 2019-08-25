import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchBarComponent } from './search-bar/search-bar.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  declarations:[SearchBarComponent],
  exports: [SearchBarComponent]
})
export class ComponentModule { }
