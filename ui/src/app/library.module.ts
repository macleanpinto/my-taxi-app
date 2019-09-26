import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [],
    entryComponents: [],
    exports: [
        IonicModule,
        FormsModule, ReactiveFormsModule, HttpClientModule, IonicModule,
        MatIconModule
    ],
    bootstrap: []
})
export class LibraryModule {

    // would be needed for shared provides
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: LibraryModule,
            providers: []
        };
    }
}
