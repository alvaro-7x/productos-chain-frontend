import { Producto } from '../../store/productos/models/producto-model';

export interface DataDialogPregunta {
  redirigir: boolean;
  url: string | null;
  variosProductos: boolean;
}

export interface RespuestaDialogoProceder {
  proceder: boolean;
  gasLimit: number;
  gasPrice: number;
}

export interface RespuestaGasServicio {
  success: boolean;
  msj: string;
  balance: number;
  gas: number;
}

export interface RespuestaServicio {
  success: boolean;
  msj: string;
  balance: number;
  productos?: Producto[];
  producto?: Producto;
  ids?: string[];
  tx?: string;
}

export interface RespuestaAuth {
  success: boolean;
  msj: string;
  data: string | null;
  cuenta?: string;
}

export interface RespuestaSocket {
  data: any;
  balance: number;
  tx: string;
}
