import { createReducer, on } from '@ngrx/store';
import { abrirDialogo, cerrarDialogo, consultarGas, consultarGasError, consultarGasSuccess, actualizarBalance, asigarMsjError, procesandoAccionEnDialogo } from './dialogo.actions';
import { environment } from '../../../environments/environment';

export interface DialogoState {
  balance: number;
  gas: number;
  procesoExitoso: boolean;
  dialogoAbierto: boolean;
  loading: boolean;
  tx: string;
  error: any;
}

export const initialState: DialogoState =
{
  balance: 0,
  gas: environment.GAS_LIMIT,
  procesoExitoso: false,
  dialogoAbierto: false,
  loading: false,
  tx: '',
  error: null
};

let local_storage = JSON.parse(localStorage.getItem('dialogo') || '{}');
if (Object.keys(local_storage).length === 0)
{
  local_storage = null;
}

export const dialogoReducer = createReducer
(
  (local_storage || initialState),

  on(abrirDialogo, (state, action) =>
  {
    return {
      ...state,
      gas: environment.GAS_LIMIT,
      procesoExitoso: false,
      dialogoAbierto: true,
      loading: true,
      tx: '',
      error: null
    };
  }),
  on(cerrarDialogo, (state, action) =>
  {
    return {
      ...initialState,
      procesoExitoso: state.procesoExitoso,
      balance: state.balance,
      gas: state.gas,
      tx: ''
    };
  }),
  on(procesandoAccionEnDialogo, (state, action) =>
  {
    return {
      ...state,
      loading: true,
      error: null
    };
  }),
  on(asigarMsjError, (state, action) =>
  {
    return {
      ...state,
      loading: false,
      error: action.error
    };
  }),

  on(consultarGas, (state, action) =>
  {
    return {
      ...state,
      loading: true,
      tx: ''
    };
  }),
  on(consultarGasSuccess, (state, action) =>
  {
    return {
      ...state,
      loading: false,
      gas: action.gas,
      balance: action.balance
    };
  }),
  on(consultarGasError, (state, action) =>
  {
    return {
      ...state,
      loading: false,
      error: action.error
    };
  }),
  on(actualizarBalance, (state, action) =>
  {
    return {
      ...state,
      balance: action.balance,
      procesoExitoso: action.procesoExitoso,
      loading: false,
      tx: action.tx,
      error: null
    };
  })
);
