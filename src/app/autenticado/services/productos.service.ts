import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Producto } from '../../store/productos/models/producto-model';
import { TOKEN_REQUERIDO } from '../../interceptors/token.httpcontext';
import { RespuestaServicio } from '../interfaces/interfaces.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService
{
  url: string = environment.url;
  context: HttpContext = new HttpContext();

  constructor (private readonly httpClient: HttpClient)
  {
    this.context.set(TOKEN_REQUERIDO, true);
  }

  listarProductos (): Observable<RespuestaServicio>
  {
    return this.httpClient.get<RespuestaServicio>(`${this.url}/productos`, { context: this.context })
      .pipe(catchError(this.handleError));
  }

  eliminarProducto (id: string, gasLimit: number, gasPrice: number): Observable<RespuestaServicio>
  {
    return this.httpClient.delete<RespuestaServicio>(`${this.url}/productos/${id}`, { context: this.context, body: { gasLimit, gasPrice } })
      .pipe(catchError(this.handleError));
  }

  eliminarVariosProductos (id: string[], gasPrice: number): Observable<RespuestaServicio>
  {
    const body = { id, gasPrice };

    return this.httpClient.post<RespuestaServicio>(`${this.url}/productos/eliminar`, body, { context: this.context })
      .pipe(delay(1000), catchError(this.handleError));
  }

  crearProducto (producto: Producto, imagen: File, gasLimit: number, gasPrice: number): Observable<RespuestaServicio>
  {
    const productoData: any = new FormData();

    const keys = Object.keys(producto);
    const values = Object.values(producto);

    for (const i in keys)
    {
      productoData.append(keys[i], values[i]);
    }

    productoData.append('imagen', imagen);
    productoData.append('gasLimit', gasLimit);
    productoData.append('gasPrice', gasPrice);

    return this.httpClient.post<RespuestaServicio>(`${this.url}/productos`, productoData, { context: this.context })
      .pipe(catchError(this.handleError));
  }

  editarProducto (id: string): Observable<RespuestaServicio>
  {
    return this.httpClient.get<RespuestaServicio>(`${this.url}/productos/${id}`, { context: this.context })
      .pipe(catchError(this.handleError));
  }

  actualizarProducto (producto: Producto, imagen: File, id: string | null, gasLimit: number, gasPrice: number): Observable<RespuestaServicio>
  {
    if (id == null)
    {
      id = '';
    }

    const productoData: any = new FormData();

    const keys = Object.keys(producto);
    const values = Object.values(producto);

    for (const i in keys)
    {
      productoData.append(keys[i], values[i]);
    }

    productoData.append('imagen', imagen);
    productoData.append('gasLimit', gasLimit);
    productoData.append('gasPrice', gasPrice);

    return this.httpClient.put<RespuestaServicio>(`${this.url}/productos/${id}`, productoData, { context: this.context })
      .pipe(catchError(this.handleError));
  }

  handleError (error: HttpErrorResponse)
  {
    let msj = 'Ocurrio un error desconocido, vuelva a intentarlo en unos minutos.';

    if (error.message.includes('404'))
    {
      return throwError({ success: false, msj: 'Servicio esta temporalmente deshabilitado, vuelva a intentarlo en unos minutos.' });
    }

    if (error.hasOwnProperty('error') && error.error.hasOwnProperty('msj'))
    {
      msj = error.error.msj;
    }

    return throwError({ success: false, msj });
  }
}
