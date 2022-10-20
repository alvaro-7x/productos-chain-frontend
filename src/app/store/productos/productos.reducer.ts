import { createReducer, on } from '@ngrx/store';
import { Producto } from './models/producto-model';
import {

  seleccionarProducto,
  deseleccionarTodosProductos,
  deseleccionarProducto,

  eliminarProducto,
  eliminarProductoSuccess,
  eliminarVariosProductosSuccess,
  eliminarProductoError,

  crearProducto,
  guardarProducto,
  guardarProductoSuccess,
  guardarProductoError,

  listarProductos,
  listarProductosSuccess,
  listarProductosError,

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

} from './productos.actions';

export interface ProductosState {

  productos: Producto[];
  productosSeleccionados: string[];
  productoSeleccionado: Producto | null;

  productosBusqueda: Producto[];
  buscando: boolean;

  loading: boolean;
  loaded: boolean;
  error: any;
}

export const initialState: ProductosState =
{
  productos: [],
  productosSeleccionados: [],
  productoSeleccionado: null,
  productosBusqueda: [],
  buscando: false,
  loading: false,
  loaded: false,
  error: null
};

let local_storage = JSON.parse(localStorage.getItem('productos') || '{}');
if (Object.keys(local_storage).length === 0)
{
  local_storage = null;
}

export const productosReducer = createReducer
(
  (local_storage || initialState),

  // listar Productos
  on(listarProductos, (state, action) => ({ ...initialState, loading: true, error: null })),
  on(listarProductosSuccess, (state, action) => ({ ...state, productos: action.productos, loading: false, loaded: true })),
  on(listarProductosError, (state, { error }) => ({ ...state, loading: false, loaded: false, error })),

  // seleccionar producto
  on(seleccionarProducto, (state, { id }) =>
  {
    return {
      ...state,
      productoSeleccionado: null,
      productosSeleccionados: state.productosSeleccionados.includes(id)
        ? state.productosSeleccionados.filter((productoId: string) => (productoId !== id)) // ya existe
        : [...state.productosSeleccionados, id] // no existe,
    };
  }),

  on(deseleccionarProducto, (state, { id }) =>
  {
    return {
      ...state,
      productoSeleccionado: null,
      productosSeleccionados: state.productosSeleccionados.filter((productoId: string) => (productoId !== id))
    };
  }),

  // deseleccionar producto
  on(deseleccionarTodosProductos, (state) =>
  {
    return {
      ...state,
      productosSeleccionados: []
    };
  }),

  // eliminar producto
  on(eliminarProducto, (state, action) =>
  {
    return {
      ...state,
      loading: true,
      error: null
    };
  }),
  on(eliminarProductoSuccess, (state, action) =>
  {
    return {
      ...state,

      buscando: false,
      productosBusqueda: [],

      productos: state.productos.filter((producto: Producto) => producto.id !== action.id),
      // productosSeleccionados: state.productosSeleccionados.filter( productoId => (productoId !== id) ),
      productosSeleccionados: [],
      loading: false,
      error: null
    };
  }),
  on(eliminarVariosProductosSuccess, (state, action) =>
  {
    return {
      ...state,

      buscando: false,
      productosBusqueda: [],
      productos: state.productos.filter((producto: Producto) => !action.id.includes(producto.id)),
      productosSeleccionados: [],
      loading: false,
      error: null
    };
  }),
  on(eliminarProductoError, (state, action) =>
  {
    return {
      ...state,
      loading: false,
      error: action.error
    };
  }),

  // crear producto
  on(crearProducto, (state, action) =>
  {
    return {
      ...state,
      buscando: false,
      productosBusqueda: [],
      productoSeleccionado: null,
      error: null
    };
  }),

  // guardar producto
  on(guardarProducto, (state, action) =>
  {
    return {
      ...state,
      loading: true
    };
  }),
  on(guardarProductoSuccess, (state, action: any) =>
  {
    return {
      ...state,

      buscando: false,
      productosBusqueda: [],

      loading: false,
      productos: [action.producto, ...state.productos]
    };
  }),
  on(guardarProductoError, (state, action: any) =>
  {
    return {
      ...state,
      loading: false,
      error: action.error
    };
  }),

  // editar producto
  on(editarProducto, (state, action: any) =>
  {
    return {
      ...state,
      loading: true,
      productoSeleccionado: null,
      productosSeleccionados: [],
      error: null
    };
  }),
  on(editarProductoSuccess, (state, action: any) =>
  {
    return {
      ...state,

      buscando: false,
      productosBusqueda: [],

      loading: false,
      productoSeleccionado: action.producto,
      productosSeleccionados: [],
      error: null
    };
  }),
  on(editarProductoError, (state, action: any) =>
  {
    return {
      ...state,
      loading: false,
      productoSeleccionado: null,
      productosSeleccionados: [],
      error: action.error
    };
  }),

  on(actualizarProducto, (state, action) =>
  {
    return {
      ...state,
      loading: true,
      error: null
    };
  }),
  on(actualizarProductoSuccess, (state, action) =>
  {
    return {
      ...state,
      loading: false,
      productos: state.productos.map((producto: Producto) =>
      {
        if (producto.id === action.producto.id)
        {
          return action.producto;
        }
        else
        {
          return producto;
        }
      }),
      productoSeleccionado: null
    };
  }),
  on(actualizarProductoError, (state, action) =>
  {
    return {
      ...state,
      loading: false,
      error: action.error
    };
  }),

  on(iniciarBusquedaProducto, (state, action) =>
  {
    return {
      ...state,
      buscando: true,
      productosBusqueda: state.productos.filter((producto: Producto) =>
      {
        if (producto.nombre.toLowerCase().includes(action.buscar.toLowerCase()))
        {
          return producto;
        }

        return false;
      })
    };
  }),
  on(terminarBusquedaProducto, (state, action) =>
  {
    return {
      ...state,
      buscando: false,
      productosBusqueda: []
    };
  }),

  on(limpiarErrorProducto, (state, action) =>
  {
    return {
      ...state,
      error: null
    };
  }),

  on(asignarErrorProducto, (state, action) =>
  {
    return {
      ...state,
      error: action.error
    };
  })

);
