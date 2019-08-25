import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';
import { CustomerComponent } from './customer/customer.component';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { ComponentModule } from '../components/component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    ComponentModule,
    RouterModule.forRoot([
      { path: '', component: CustomerComponent },
      { path: 'search', component: SearchBarComponent }
    ])
  ],
  declarations: [CustomerComponent]
})
export class CustomerModule { }
