import { Injectable, NgZone } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of, tap } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { TiposAcciones } from '../../types/TiposAcciones';
import { AuthService } from '../../services/auth.service';
import {
  CoreAuthActionsAll,
  conectarWalletError, conectarWalletSuccess, desconectarWalletError, desconectarWalletSuccess, generarToken,
  login, noAccion
} from './auth.actions';
import { Router } from '@angular/router';
import { AppState } from '../../app.reducers';
import { Store } from '@ngrx/store';
import { DialogoService } from '../../autenticado/services/dialogo.service';
import { RespuestaAuth } from '../../autenticado/interfaces/interfaces.interface';

@Injectable()
export class AuthEffects
{
  conectarWallet$ = createEffect(() => this.actions$.pipe(
    ofType(TiposAcciones.conectarWallet),

    mergeMap((action) => from(this.authService.getCuenta()).pipe
    (
      map((resp: RespuestaAuth) =>
      {
        return generarToken({ cuenta: resp.data });
      }),
      catchError((error: any) =>
      {
        return of(conectarWalletError({ error: error.msj }));
      })
    ))
  )
  );

  generarToken$ = createEffect(() => this.actions$.pipe(
    ofType(TiposAcciones.generarToken),

    mergeMap((action) => from(this.authService.generarJWT(action.cuenta)).pipe
    (
      map((resp: RespuestaAuth) =>
      {
        return login({ token: resp.data });
      }),
      catchError((error: any) =>
      {
        return of(conectarWalletError({ error: error.msj }));
      })
    ))
  )
  );

  login$ = createEffect(() => this.actions$.pipe(
    ofType(TiposAcciones.realizarLogin),

    mergeMap((action) => this.authService.login(action.token).pipe
    (
      map((resp: RespuestaAuth) =>
      {
        return conectarWalletSuccess({ cuenta: resp.cuenta! });
      }),
      catchError((error: any) =>
      {
        return of(conectarWalletError({ error: error.msj }));
      })
    ))
  )
  );

  validarToken$ = createEffect(() => this.actions$.pipe(
    ofType(TiposAcciones.validarToken),
    mergeMap((action) => this.authService.validarToken().pipe
    (
      map((resp: boolean) =>
      {
        return !resp ? desconectarWalletSuccess() : noAccion();
      })
    ))
  )
  );

  redirectLoginSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(TiposAcciones.conectarWalletSuccess),
    tap(async (action: any) => await this.router.navigate(['wallet/productos'], { replaceUrl: true }))
  ),
  { dispatch: false }
  );

  desconectarWallet$ = createEffect(() => this.actions$.pipe(
    ofType(TiposAcciones.desconectarWallet),
    tap(() =>
    {
      this.dialogoService.cerrarDialogo();
    }),
    mergeMap((action) => this.authService.logout().pipe
    (
      map((resp: RespuestaAuth) =>
      {
        return desconectarWalletSuccess();
      }),
      catchError((error: any) =>
      {
        return of(desconectarWalletError({ error: error.msj }));
      })
    ))
  )
  );

  redirectLogout$ = createEffect(() => this.actions$.pipe(
    ofType(TiposAcciones.desconectarWalletSuccess),
    tap(async (action: any) =>
    {
      return await this.zone.run(async () =>
      {
        await this.router.navigate(['auth/login'], { replaceUrl: true });
      });
    })
  ),
  { dispatch: false }
  );

  saveStateAuth$ = createEffect(() => this.actions$.pipe(
    ofType(
      TiposAcciones.conectarWalletSuccess,
      TiposAcciones.desconectarWalletError
    ),
    withLatestFrom(this.store.select('auth')),
    tap((action: any) =>
    {
      localStorage.setItem('user', JSON.stringify(action[1] || ''));
    })
  ),
  { dispatch: false }
  );

  constructor (
    private readonly actions$: Actions<CoreAuthActionsAll>,
    private readonly authService: AuthService,
    private readonly dialogoService: DialogoService,
    private readonly router: Router,
    private readonly store: Store<AppState>,
    private readonly zone: NgZone
  )
  {
  }
}
