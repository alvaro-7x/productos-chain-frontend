import { createAction, props, union } from '@ngrx/store';

import { TiposAcciones } from '../../types/TiposAcciones';

// conectar wallet
export const conectarWallet = createAction
(
  TiposAcciones.conectarWallet
);

export const generarToken = createAction
(
  TiposAcciones.generarToken,
  props<{ cuenta: string | null }>()
);

export const login = createAction
(
  TiposAcciones.realizarLogin,
  props<{ token: string | null }>()
);

export const validarToken = createAction
(
  TiposAcciones.validarToken
);

export const noAccion = createAction
(
  TiposAcciones.noAccion
);

export const conectarWalletSuccess = createAction
(
  TiposAcciones.conectarWalletSuccess,
  props<{ cuenta: string | null }>()
);

export const conectarWalletError = createAction
(
  TiposAcciones.conectarWalletError,
  props<{ error: any }>()
);

// desconectar wallet
export const desconectarWallet = createAction
(
  TiposAcciones.desconectarWallet
);
export const desconectarWalletSuccess = createAction
(
  TiposAcciones.desconectarWalletSuccess
);
export const desconectarWalletError = createAction
(
  TiposAcciones.desconectarWalletError,
  props<{ error: any }>()
);

const acciones = union({

  conectarWallet,
  conectarWalletSuccess,
  conectarWalletError,
  generarToken,
  validarToken,
  login,
  desconectarWallet,
  desconectarWalletSuccess,
  desconectarWalletError,
  noAccion
});

export type CoreAuthActionsAll = typeof acciones
