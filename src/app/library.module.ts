import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatFormFieldModule } from '@angular/material';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [],
    entryComponents: [],
    exports: [MatButtonModule, MatCardModule, IonicModule, MatFormFieldModule,
        FormsModule, HttpClientModule,FormsModule,
        ReactiveFormsModule],
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
