import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatButtonToggleModule } from '@angular/material';
import { IonicModule } from '@ionic/angular';
import { ModuleWithProviders } from '@angular/core';

@NgModule({
    declarations: [],
    entryComponents: [],
    exports: [
        IonicModule,
        MatButtonToggleModule,
        MatButtonModule,
        FormsModule
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
