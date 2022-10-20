import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Producto } from './models/producto-model';
import { ProductosState } from './productos.reducer';
import { AuthState } from '../auth/auth.reducer';

export const estadoProductos = createFeatureSelector<ProductosState>('productos');
export const estadoAuth = createFeatureSelector<AuthState>('auth');

export const productos = createSelector(
  estadoProductos,
  (estadoProductos) =>
  {
    const prod = (estadoProductos.buscando)
      ? estadoProductos.productosBusqueda
      : estadoProductos.productos;

    return prod.map((producto: Producto) =>
    {
      if (estadoProductos.productosSeleccionados.includes(producto.id))
      {
        return { ...producto, seleccionado: true };
      }
      else
      {
        return { ...producto, seleccionado: false };
      }
    });
  }
);

export const productoSeleccionado = createSelector(
  estadoProductos,
  (estadoProductos) =>
  {
    return estadoProductos.productoSeleccionado;
  }
);

export const productosCargados = createSelector(
  estadoProductos,
  estadoAuth,
  (estadoProductos, estadoAuth) =>
  {
    if (estadoProductos.loading)
    {
      return null;
    }

    if (!!estadoAuth.cuenta)
    {
      return estadoProductos.loaded;
    }

    return null;
  }
);

export const misProductos = createSelector(
  estadoProductos,
  estadoAuth,
  (estadoProductos, estadoAuth) =>
  {
    let cantidad = 0;

    if (!estadoAuth.cuenta)
    {
      return cantidad;
    }

    estadoProductos.productos.map((producto: Producto) =>
    {
      const creadoPor = producto.creadoPor;
      const cuenta = estadoAuth.cuenta || '';

      if (creadoPor.toLowerCase() === cuenta.toLowerCase())
      {
        cantidad++;
      }
    });

    return cantidad;
  }
);
