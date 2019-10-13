import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LibraryModule } from '../library.module';
import { PricingService } from '../providers/pricing.service';
import { custStoreProviders } from './customer.store';
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
      apiKey: 'AIzaSyB7I8TFc9t7YE0SVY7XcheXnydneuW16G8',
      libraries: ['places']
    })
  ],
  declarations: [CustomerComponent, SearchBarComponent],
  providers: [PricingService, custStoreProviders]
})
export class CustomerModule { }
