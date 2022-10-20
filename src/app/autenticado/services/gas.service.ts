import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TOKEN_REQUERIDO } from '../../interceptors/token.httpcontext';
import { Producto } from '../../store/productos/models/producto-model';
import { RespuestaGasServicio } from '../interfaces/interfaces.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class GasService
{
  url: string = environment.url;
  context: HttpContext = new HttpContext();

  constructor (private readonly httpClient: HttpClient)
  {
    this.context.set(TOKEN_REQUERIDO, true);
  }

  consultarGas (tipo: number, producto: Producto | null, id: string | string[] | null)
  {
    const body =
    {
      tipo,
      producto,
      id
    };
    return this.httpClient.post<RespuestaGasServicio>(`${this.url}/productos/consultar-gas`, body, { context: this.context })
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
