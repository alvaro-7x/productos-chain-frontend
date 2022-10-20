export interface Producto {
  id: string;
  nombre: string;
  imagen: string;
  descripcion: string;
  destacado: boolean;
  creadoPor: string;
  creadoEn: number;
  seleccionado?: boolean;
}
