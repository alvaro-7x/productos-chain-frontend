import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const estadoAuth = createFeatureSelector<AuthState>('auth');

export const usuarioLogueado = createSelector(
  estadoAuth,
  (estadoAuth) =>
  {
    return estadoAuth.logueado;
  }
);
