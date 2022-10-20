import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Estas linea son solo para desarrollo
// import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// import { environment } from '../environments/environment';
import { VerificarTokenInterceptor } from './interceptors/verificar-token.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { authReducer, metaReducers } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    
    // De esta forma se carga todo el store y todos los effects, pero en el proyecto se cargara en sus respectivos módulos
    // StoreModule.forRoot(appReducers),
    // EffectsModule.forRoot([AuthEffects, ProductosEffects, DialogoEffects]),

    StoreModule.forRoot({'auth': authReducer},{metaReducers}),
    EffectsModule.forRoot([AuthEffects]),

    // Esta line es solo para desarrollo
    // StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],

  providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: VerificarTokenInterceptor,
    multi: true,
  }],

  bootstrap: [AppComponent]
})
export class AppModule { }
