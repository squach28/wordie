import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { MatIconModule } from '@angular/material/icon'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ClipboardModule } from '@angular/cdk/clipboard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PopUpComponent } from './pop-up/pop-up.component';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';
import { ResultDialogComponent } from './result-dialog/result-dialog.component';
import { WinGameDialogComponent } from './win-game-dialog/win-game-dialog.component';
import { LoseGameDialogComponent } from './lose-game-dialog/lose-game-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    PopUpComponent,
    HelpDialogComponent,
    ResultDialogComponent,
    WinGameDialogComponent,
    LoseGameDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatIconModule,
    MatDialogModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
    ClipboardModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
