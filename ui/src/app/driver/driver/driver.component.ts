import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';
import { RideSearchRequest } from 'src/app/models';

@Component({
    selector: 'app-driver',
    templateUrl: './driver.component.html',
    styleUrls: ['./driver.component.scss'],
})
export class DriverComponent implements OnInit {
    request;
    constructor(private firestore: AngularFirestore, private loadingController: LoadingController) { }

    ngOnInit() {
        this.loadingController.create({
            message: 'Finding Rides...',
        }).then(loading => loading.present());
        this.firestore.collection('cabSearchRequests').valueChanges().subscribe(res => {
            console.log(res);
            this.request = res;
            this.loadingController.dismiss();
        });
    }

}
