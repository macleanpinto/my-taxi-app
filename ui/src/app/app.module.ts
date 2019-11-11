import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LibraryModule } from './library.module';
import { environment } from 'src/environments/environment';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports:
        [BrowserModule,
            BrowserAnimationsModule,
            AppRoutingModule,
            LibraryModule.forRoot(),
            IonicStorageModule.forRoot(),
            IonicModule.forRoot(),
            MatIconModule
        ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
