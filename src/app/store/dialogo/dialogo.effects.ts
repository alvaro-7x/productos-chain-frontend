import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap, withLatestFrom } from 'rxjs/operators';

import { AppState } from '../../app.reducers';
import { Store } from '@ngrx/store';
import { CoreDialogoActionsAll, consultarGasError, consultarGasSuccess } from './dialogo.actions';
import { estadoDialogoGuardar } from './dialogo.selector';
import { GasService } from '../../autenticado/services/gas.service';
import { DialogoService } from '../../autenticado/services/dialogo.service';
import { RespuestaGasServicio } from '../../autenticado/interfaces/interfaces.interface';
import { TiposAcciones } from '../../types/TiposAcciones';

@Injectable()
export class DialogoEffects
{
  abrirDialogo$ = createEffect(() => this.actions$.pipe(
    ofType(TiposAcciones.abrirDialogo),
    tap((action) => this.dialogoService.abrirDialogPregunta(action.data)),
    mergeMap((action) => this.gasService.consultarGas(action.tipo, action.producto, action.id).pipe
    (
      map((resp: RespuestaGasServicio) =>
      {
        return consultarGasSuccess({ gas: resp.gas, balance: resp.balance });
      }),
      catchError((error: any) =>
      {
        return of(consultarGasError({ error: error.msj }));
      })
    ))
  )
  );

  saveStateDialogo$ = createEffect(() => this.actions$.pipe(
    ofType(TiposAcciones.actualizarBalance),
    withLatestFrom(this.store.select(estadoDialogoGuardar)),
    tap((action: any) =>
    {
      localStorage.setItem('dialogo', JSON.stringify(action[1] || ''));
    })
  ),
  { dispatch: false }
  );

  constructor (
    private readonly actions$: Actions<CoreDialogoActionsAll>,
    private readonly gasService: GasService,
    private readonly dialogoService: DialogoService,
    private readonly store: Store<AppState>
  )
  {}
}
