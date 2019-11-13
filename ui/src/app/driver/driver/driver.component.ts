import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
})
export class DriverComponent implements OnInit {

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    this.firestore.collection('cabSearchRequests').valueChanges().subscribe(res => {
      console.log(res);
    });
  }

}
