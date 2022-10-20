import { createAction, props, union } from '@ngrx/store';

import { TiposAcciones } from '../../types/TiposAcciones';
import { Producto } from './models/producto-model';

// listar Productos
export const listarProductos = createAction(
  TiposAcciones.listarProductos
);
export const listarProductosSuccess = createAction(
  TiposAcciones.listarProductosSuccess,
  props<{ productos: Producto[], balance: number, tx?: string }>()
);
export const listarProductosError = createAction(
  TiposAcciones.listarProductosError,
  props<{ error: any }>()
);

// seleccionar producto
export const seleccionarProducto = createAction(
  TiposAcciones.seleccionarProducto,
  props<{ id: string }>()
);

// deseleccionar producto
export const deseleccionarProducto = createAction(
  TiposAcciones.deseleccionarProducto,
  props<{ id: string }>()
);

// deseleccionar TODOS los producto
export const deseleccionarTodosProductos = createAction(
  TiposAcciones.deseleccionarTodosLosProductos
);

// eliminar producto
export const eliminarProducto = createAction(
  TiposAcciones.eliminarProducto,
  props<{ id: string, gasLimit: number, gasPrice: number }>()
);
export const eliminarVariosProductos = createAction(
  TiposAcciones.eliminarVariosProductos,
  props<{ id: string[], gasPrice: number }>()
);
export const eliminarVariosProductosSuccess = createAction(
  TiposAcciones.eliminarVariosProductosSuccess,
  props<{ id: string[], balance: number, tx?: string }>()
);
export const eliminarProductoSuccess = createAction(
  TiposAcciones.eliminarProductoSuccess,
  props<{ id: string, balance: number, tx?: string }>()
);
export const eliminarProductoError = createAction(
  TiposAcciones.eliminarProductoError,
  props<{ error: any }>()
);

// crear producto
export const crearProducto = createAction(
  TiposAcciones.crearProducto
);

// guadar producto
export const guardarProducto = createAction(
  TiposAcciones.guardarProducto,
  props<{ producto: Producto, imagen: File, gasLimit: number, gasPrice: number }>()
);
export const guardarProductoSuccess = createAction(
  TiposAcciones.guardarProductoSuccess,
  props<{ producto: Producto, balance: number, tx?: string }>()
);
export const guardarProductoError = createAction(
  TiposAcciones.guardarProductoError,
  props<{ error: any }>()
);

// editar producto
export const editarProducto = createAction(
  TiposAcciones.editarProducto,
  props<{ id: string }>()
);
export const editarProductoSuccess = createAction(
  TiposAcciones.editarProductoSuccess,
  props<{ producto: Producto | null }>()
);
export const editarProductoError = createAction(
  TiposAcciones.editarProductoError,
  props<{ error: any }>()
);

// actualizar producto
export const actualizarProducto = createAction(
  TiposAcciones.actualizarProducto,
  props<{ producto: Producto, imagen: File, id: string | null, gasLimit: number, gasPrice: number }>()
);
export const actualizarProductoSuccess = createAction(
  TiposAcciones.actualizarProductoSuccess,
  props<{ producto: Producto, balance: number, tx?: string }>()
);
export const actualizarProductoError = createAction(
  TiposAcciones.actualizarProductoError,
  props<{ error: any }>()
);

// Busqueda producto
export const iniciarBusquedaProducto = createAction(
  TiposAcciones.iniciarBusquedaProducto,
  props<{ buscar: string }>()
);
export const terminarBusquedaProducto = createAction(
  TiposAcciones.terminarBusquedaProducto
);

// Limpiar error
export const limpiarErrorProducto = createAction(
  TiposAcciones.limpiarError
);

export const asignarErrorProducto = createAction(
  TiposAcciones.asignarError,
  props<{ error: any }>()
);

const acciones = union({

  listarProductos,
  listarProductosSuccess,
  listarProductosError,

  seleccionarProducto,
  deseleccionarProducto,
  deseleccionarTodosProductos,

  eliminarProducto,
  eliminarProductoSuccess,
  eliminarVariosProductos,
  eliminarVariosProductosSuccess,
  eliminarProductoError,

  crearProducto,
  guardarProducto,
  guardarProductoSuccess,
  guardarProductoError,

  editarProducto,
  editarProductoSuccess,
  editarProductoError,

  actualizarProducto,
  actualizarProductoSuccess,
  actualizarProductoError,

  iniciarBusquedaProducto,
  terminarBusquedaProducto,

  limpiarErrorProducto,
  asignarErrorProducto

});

export type CoreProductosActionsAll = typeof acciones
