import { ActionReducer, MetaReducer, createReducer, on } from '@ngrx/store';

import { conectarWallet, conectarWalletSuccess, conectarWalletError, desconectarWallet, desconectarWalletError, desconectarWalletSuccess, generarToken, login } from './auth.actions';
import { TiposAcciones } from '../../types/TiposAcciones';

export interface AuthState {
  cuenta: string | null;
  loading: boolean;
  logueado: boolean;
  estado: string;
  error: any;
}

export const initialState: AuthState =
{
  cuenta: null,
  loading: false,
  logueado: false,
  estado: 'No conectado',
  error: null
};

let local_storage = JSON.parse(localStorage.getItem('user') || '{}');
if (Object.keys(local_storage).length === 0)
{
  local_storage = null;
}

export const authReducer = createReducer
(
  (local_storage || initialState),

  // Acciones para conectar wallet
  on(conectarWallet, (state) =>
  {
    return {
      ...state,
      loading: true,
      logueado: false,
      estado: 'Intentando conección ...',
      error: null
    };
  }),
  on(generarToken, (state) =>
  {
    return {
      ...state,
      estado: 'Seleccionando cuenta ...'
    };
  }),
  on(login, (state) =>
  {
    return {
      ...state,
      estado: 'Iniciando sesión ...'
    };
  }),
  on(conectarWalletSuccess, (state, action) =>
  {
    return {
      ...state,
      cuenta: action.cuenta,
      loading: false,
      logueado: true,
      estado: 'Conectado.',
      error: null
    };
  }),
  on(conectarWalletError, (state, action) =>
  {
    return {
      ...state,
      cuenta: null,
      loading: false,
      logueado: false,
      estado: 'No conectado',
      error: action.error
    };
  }),

  // Acciones para desconectar wallet
  on(desconectarWallet, (state) =>
  {
    return {
      ...state,
      loading: true
    };
  }),
  on(desconectarWalletSuccess, (state) =>
  {
    return initialState;
  }),
  on(desconectarWalletError, (state, action) =>
  {
    return {
      ...state,
      loading: false,
      error: action.error
    };
  })
);

export function logOut (reducer: ActionReducer<any>): ActionReducer<any>
{
  return function (state, action)
  {
    if (action.type === TiposAcciones.desconectarWalletSuccess)
    {
      state = {};
    }
    return reducer(state, action);
  };
}
export const metaReducers: Array<MetaReducer<any>> = [logOut];
