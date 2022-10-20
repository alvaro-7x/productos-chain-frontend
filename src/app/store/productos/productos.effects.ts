import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap, withLatestFrom } from 'rxjs/operators';

import {
  CoreProductosActionsAll,
  actualizarProductoError, actualizarProductoSuccess, editarProductoError, editarProductoSuccess, eliminarProductoError, eliminarProductoSuccess, eliminarVariosProductosSuccess, guardarProductoError, guardarProductoSuccess, listarProductosError, listarProductosSuccess
} from './productos.actions';

import { Router } from '@angular/router';
import { AppState } from '../../app.reducers';
import { Store } from '@ngrx/store';
import { actualizarBalance, asigarMsjError } from '../dialogo/dialogo.actions';
import { ProductosService } from '../../autenticado/services/productos.service';
import { RespuestaServicio } from '../../autenticado/interfaces/interfaces.interface';

import { TiposAcciones } from '../../types/TiposAcciones';
import { SocketService } from '../../autenticado/services/socket.service';

@Injectable()
export class ProductosEffects
{
  cargarProductos$ = createEffect(() => this.actions$.pipe(
    ofType(TiposAcciones.listarProductos),
    mergeMap(() => this.productosService.listarProductos().pipe
    (
      map((resp: RespuestaServicio) =>
      {
        const p = (resp.productos!) || [];
        const b = resp.balance || 0;
        return listarProductosSuccess({ productos: p, balance: b });
      }),
      catchError((error: any) =>
      {
        return of(listarProductosError({ error: error.msj }));
      })
    ))
  )
  );

  eliminarProducto$ = createEffect(() => this.actions$.pipe(
    ofType(TiposAcciones.eliminarProducto),
    mergeMap((action) => this.productosService.eliminarProducto(action.id, action.gasLimit, action.gasPrice).pipe
    (
      map((resp: RespuestaServicio) =>
      {
        this.socketService.emit('producto-eliminado-cliente', { data: action.id, balance: resp.balance, tx: resp.tx });
        return eliminarProductoSuccess({ id: action.id, balance: resp.balance, tx: resp.tx });
      }),
      catchError((error: any) =>
      {
        return of(eliminarProductoError({ error: error.msj }));
      })
    ))
  )
  );

  eliminarVariosProducto$ = createEffect(() => this.actions$.pipe(
    ofType(TiposAcciones.eliminarVariosProductos),
    mergeMap((action) => this.productosService.eliminarVariosProductos(action.id, action.gasPrice).pipe
    (
      map((resp: RespuestaServicio) =>
      {
        this.socketService.emit('productos-eliminados-cliente', { data: action.id, balance: resp.balance, tx: resp.tx });
        return eliminarVariosProductosSuccess({ id: action.id, balance: resp.balance, tx: resp.tx });
      }),
      catchError((error: any) =>
      {
        return of(eliminarProductoError({ error: error.msj }));
      })
    ))
  )
  );

  crearProducto$ = createEffect(() => this.actions$.pipe(
    ofType(TiposAcciones.guardarProducto),
    mergeMap((action: any) => this.productosService.crearProducto(action.producto, action.imagen, action.gasLimit, action.gasPrice).pipe
    (
      map((resp: RespuestaServicio) =>
      {
        this.socketService.emit('producto-creado-cliente', { data: resp.producto, balance: resp.balance, tx: resp.tx });
        return guardarProductoSuccess({ producto: resp.producto!, balance: resp.balance, tx: resp.tx });
      }),
      catchError((error: any) =>
      {
        return of(guardarProductoError({ error: error.msj }));
      })
    ))
  )
  );

  editarProducto$ = createEffect(() => this.actions$.pipe(
    ofType(TiposAcciones.editarProducto),
    mergeMap((action) => this.productosService.editarProducto(action.id).pipe
    (
      map((resp: RespuestaServicio) =>
      {
        const p = (resp.producto!) || null;

        return editarProductoSuccess({ producto: p });
      }),
      catchError((error: any) =>
      {
        return of(editarProductoError({ error: error.msj }));
      })
    ))
  )
  );

  redirectProductoEditar$ = createEffect(() => this.actions$.pipe(
    ofType(TiposAcciones.editarProductoSuccess),
    tap(async (action: any) => await this.router.navigate(['wallet/producto'], { replaceUrl: true }))
  ),
  { dispatch: false }
  );

  actualizarProducto$ = createEffect(() => this.actions$.pipe(
    ofType(TiposAcciones.actualizarProducto),
    mergeMap((action) => this.productosService.actualizarProducto(action.producto, action.imagen, action.id, action.gasLimit, action.gasPrice).pipe
    (
      map((resp: RespuestaServicio) =>
      {
        this.socketService.emit('producto-actualizado-cliente', { data: resp.producto, balance: resp.balance, tx: resp.tx });
        return actualizarProductoSuccess({ producto: resp.producto!, balance: resp.balance, tx: resp.tx });
      }),
      catchError((error: any) =>
      {
        return of(actualizarProductoError({ error: error.msj }));
      })
    ))
  )
  );

  saveStateProductos$ = createEffect(() => this.actions$.pipe(
    ofType(
      TiposAcciones.listarProductos,
      TiposAcciones.listarProductosSuccess,
      TiposAcciones.listarProductosError,

      TiposAcciones.eliminarProducto,
      TiposAcciones.eliminarProductoSuccess,
      TiposAcciones.eliminarProductoError,

      TiposAcciones.crearProducto,
      TiposAcciones.guardarProducto,
      TiposAcciones.guardarProductoSuccess,
      TiposAcciones.guardarProductoError,

      TiposAcciones.editarProducto,
      TiposAcciones.editarProductoSuccess,
      TiposAcciones.editarProductoError,

      TiposAcciones.actualizarProducto,
      TiposAcciones.actualizarProductoSuccess,
      TiposAcciones.actualizarProductoError,

      TiposAcciones.seleccionarProducto,
      TiposAcciones.deseleccionarProducto,
      TiposAcciones.deseleccionarTodosLosProductos,

      TiposAcciones.limpiarError

    ),
    withLatestFrom(this.store.select('productos')),
    tap((action: any) =>
    {
      localStorage.setItem('productos', JSON.stringify(action[1] || ''));
    })
  ),
  { dispatch: false }
  );

  actualizarBalance$ = createEffect(() => this.actions$.pipe(
    ofType(

      TiposAcciones.listarProductosSuccess,
      TiposAcciones.eliminarProductoSuccess,
      TiposAcciones.eliminarVariosProductosSuccess,
      TiposAcciones.guardarProductoSuccess,
      TiposAcciones.actualizarProductoSuccess

    ),
    map((action) =>
    {
      const tx = action.tx || '';
      const procesoExitoso = action.type !== TiposAcciones.listarProductosSuccess;
      return actualizarBalance({ balance: action.balance, procesoExitoso, tx });
    })
  ));

  enviarErrorAlDialogo$ = createEffect(() => this.actions$.pipe(
    ofType(

      TiposAcciones.actualizarProductoError,
      TiposAcciones.eliminarProductoError,
      TiposAcciones.guardarProductoError,
      TiposAcciones.actualizarProductoError
    ),
    map((action) =>
    {
      return asigarMsjError({ error: action.error });
    })
  ));

  constructor (
    private readonly actions$: Actions<CoreProductosActionsAll>,
    private readonly productosService: ProductosService,
    private readonly router: Router,
    private readonly store: Store<AppState>,
    private readonly socketService: SocketService
  )
  {}
}
