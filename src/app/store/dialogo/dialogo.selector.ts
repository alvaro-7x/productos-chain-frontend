import { createSelector, createFeatureSelector } from '@ngrx/store';

import { DialogoState, initialState } from './dialogo.reducer';

export const estadoDialogo = createFeatureSelector<DialogoState>('dialogo');

export const gasEstimado = createSelector(
  estadoDialogo,
  (estadoDialogo) =>
  {
    return estadoDialogo.gas;
  }
);

export const procesoExitoso = createSelector(
  estadoDialogo,
  (estadoDialogo) =>
  {
    return estadoDialogo.procesoExitoso;
  }
);

export const estadoDialogoGuardar = createSelector(
  estadoDialogo,
  (estadoDialogo) =>
  {
    return {
      ...initialState,
      balance: estadoDialogo.balance
    };
  }
);
