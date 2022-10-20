import { ActionReducerMap } from '@ngrx/store';
import { AuthState, authReducer } from './store/auth/auth.reducer';
import { ProductosState, productosReducer } from './store/productos/productos.reducer';
import { DialogoState, dialogoReducer } from './store/dialogo/dialogo.reducer';

export interface AppState {
  auth: AuthState;
  productos: ProductosState;
  dialogo: DialogoState;
}

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  productos: productosReducer,
  dialogo: dialogoReducer,
};