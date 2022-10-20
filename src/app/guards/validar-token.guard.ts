import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { desconectarWallet } from '../store/auth/auth.actions';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard implements CanActivate, CanLoad
{
  constructor (private authService: AuthService, private store: Store)
  { }

  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
  {
    return this.authService.validarToken()
      .pipe(
        tap((valid: boolean) =>
        {
          if (!valid)
          {
            this.store.dispatch(desconectarWallet());
          }
        })
      );
  }

  canLoad (
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean
  {
    return this.authService.validarToken()
      .pipe(
        tap((valid: boolean) =>
        {
          if (!valid)
          {
            this.store.dispatch(desconectarWallet());
          }
        })
      );
  }
}
