import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { TestErrorComponent } from './test-error/test-error.component';
import { NotFoundsComponent } from './not-founds/not-founds.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule
  ],
  declarations: [CoreComponent, TestErrorComponent, NotFoundsComponent, ServerErrorComponent]
})
export class CoreModule { }
