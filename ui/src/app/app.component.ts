import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Route, ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    isHomePage = true;
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar, private router: Router
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            firebase.initializeApp(environment.firebaseConfig);
        });
    }
    ngOnInit(): void {
        this.router.events
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(
                (event) => {
                    if (event instanceof NavigationEnd) {
                        if (event.url === '/') {
                            this.isHomePage = true;
                        } else {
                            this.isHomePage = false;
                        }
                    }
                });
    }
    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}

