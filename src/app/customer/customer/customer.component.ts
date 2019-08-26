import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() { 
    console.log(history.state.data);
  }

  pickLocation(direction: string) {
    this.router.navigate(['/search'], {state: {data: {field: direction}}});
  }
  segmentChanged($event) {
    console.log($event);
  }
}
