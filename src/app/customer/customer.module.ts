import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LibraryModule } from '../library.module';
import { PricingService } from '../providers/pricing.service';
import { CustomerComponent } from './customer/customer.component';
import { SearchBarComponent } from './search-bar/search-bar.component';

@NgModule({
  imports: [
    CommonModule,
    LibraryModule,
    RouterModule.forChild([
      { path: '', component: CustomerComponent },
      { path: 'search', component: SearchBarComponent }
    ]),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAWmu0anN3l5ZmC0l_Lyee7IQi7Tkv_dg0',
      libraries: ['places']
    })
  ],
  declarations: [CustomerComponent, SearchBarComponent],
  providers: [PricingService]
})
export class CustomerModule { }
