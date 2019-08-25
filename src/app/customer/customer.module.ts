import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { LibraryModule } from '../library.module';
import { CustomerComponent } from './customer/customer.component';


@NgModule({
  imports: [
    LibraryModule,
    RouterModule.forChild([
      { path: '', component: CustomerComponent },
      { path: 'search', component: SearchBarComponent }
    ])
  ],
  declarations: [CustomerComponent, SearchBarComponent]
})
export class CustomerModule { }
