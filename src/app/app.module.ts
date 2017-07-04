import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PlayerComponent} from './player/player.component';
import {PlayerService} from "./player/player.service";
import {HttpModule} from "@angular/http";

@NgModule({
    declarations: [
        AppComponent,
        PlayerComponent
    ],
    imports: [
        BrowserModule,
        HttpModule
    ],
    providers: [PlayerService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
