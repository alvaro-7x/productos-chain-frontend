import { Injectable } from '@angular/core';
import {
  HttpErrorResponse, HttpHeaders, HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import { NEVER, Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducers';
import { TOKEN_REQUERIDO } from './token.httpcontext';
import { desconectarWallet } from '../store/auth/auth.actions';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class VerificarTokenInterceptor implements HttpInterceptor
{
  constructor (
    private store: Store<AppState>
  )
  { }

  intercept (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>
  {
    let requestClone = request;

    if (requestClone.context.get(TOKEN_REQUERIDO) === true)
    {
      const token = localStorage.getItem('token') || '';

      if (token.length === 0)
      {
        this.store.dispatch(desconectarWallet());
        return NEVER;
      }
      else
      {
        const headers = new HttpHeaders().set('x-token', token);
        requestClone = request.clone({ headers });
      }
    }

    return next.handle(requestClone).pipe(
      tap((httpEvent: any) =>
      {
        if (httpEvent instanceof HttpResponse)
        {
          if (httpEvent.headers.has('x-token'))
          {
            const nuevoToken = httpEvent.headers.get('x-token') || '';

            if (nuevoToken.length === 0)
            {
              this.store.dispatch(desconectarWallet());
            }
            else
            {
              localStorage.setItem('token', nuevoToken);
            }
          }
        }
      }),
      catchError(this.manejarError)
    );
  }

  manejarError (error: HttpErrorResponse)
  {
    if (error.headers.has('x-token'))
    {
      const token = error.headers.get('x-token') || '';
      if (token.length === 0)
      {
        localStorage.removeItem('token');
      }
    }
    return throwError(error);
  }
}
