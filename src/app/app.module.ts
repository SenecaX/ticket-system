import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/authentication/login/login.component';
import { RegistrationComponent } from './features/authentication/registration/registration.component';
import { DashboardComponent } from './features/kanban/dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  TicketHttpInterceptor,
  JwtInterceptor,
  ErrorInterceptor
} from './shared/interceptor';
import { AlertComponent } from './shared/components/alert/alert.component';
import { JwtModule } from '@auth0/angular-jwt';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    DashboardComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    DragDropModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['http://localhost:3000/', 'http://localhost:3001/']
      }
    }),
    FontAwesomeModule
  ],
  providers: [
    TicketHttpInterceptor,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
