import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';
import { CustomerComponent } from './customer/customer.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    RouterModule.forChild([{ path: '', component: CustomerComponent }])
  ],
  declarations: [CustomerComponent]
})
export class Tab1PageModule {}
