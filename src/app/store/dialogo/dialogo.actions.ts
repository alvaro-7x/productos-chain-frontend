import { createAction, props, union } from '@ngrx/store';
import { TiposAcciones } from '../../types/TiposAcciones';
import { Producto } from '../productos/models/producto-model';
import { DataDialogPregunta } from '../../autenticado/interfaces/interfaces.interface';

export const abrirDialogo = createAction(
  TiposAcciones.abrirDialogo,
  props<{ tipo: number, producto: Producto | null, id: string | string[] | null, data: DataDialogPregunta }>()
);

export const cerrarDialogo = createAction(
  TiposAcciones.cerrarDialogo
);

export const procesandoAccionEnDialogo = createAction(
  TiposAcciones.procesandoAccionEnDialogo
);

// consultar gas
export const consultarGas = createAction(
  TiposAcciones.consultarGas,
  props<{ tipo: number, producto: Producto | null, id: string | string[] | null }>()
);
export const consultarGasSuccess = createAction(
  TiposAcciones.consultarGasSuccess,
  props<{ gas: number, balance: number }>()
);
export const consultarGasError = createAction(
  TiposAcciones.consultarGasError,
  props<{ error: any }>()
);
export const actualizarBalance = createAction(
  TiposAcciones.actualizarBalance,
  props<{ balance: number, procesoExitoso: boolean, tx: string }>()
);
export const asigarMsjError = createAction(
  TiposAcciones.asignarMensajeDeError,
  props<{ error: any }>()
);

const acciones = union({

  abrirDialogo,
  cerrarDialogo,

  procesandoAccionEnDialogo,

  consultarGas,
  consultarGasSuccess,
  consultarGasError,

  actualizarBalance,

  asigarMsjError
});

export type CoreDialogoActionsAll = typeof acciones
