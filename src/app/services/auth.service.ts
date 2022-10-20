import { Injectable } from '@angular/core';

import Web3 from 'web3';
import { sign } from 'web3-token';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { RespuestaAuth } from '../autenticado/interfaces/interfaces.interface';
import { environment } from '../../environments/environment';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  web3: Web3 | null = null;
  chainIds = environment.CHAINIDS;

  url: string = environment.url;
  cuenta: string = '';

  constructor (private httpClient: HttpClient)
  {
    if (window.ethereum)
    {
      this.web3 = new Web3(window.ethereum);
    }
  }

  async getCuenta ()
  {
    if (!window.ethereum)
    {
      throw ({ success: false, msj: 'Instale MetaMask para ingresar en la aplicación.' });
    }

    const chainId: string = await window.ethereum.request({ method: 'eth_chainId' });

    if (!this.chainIds.includes(chainId))
    {
      throw ({ success: false, msj: 'La red seleccionada no es la adecuada, debe selecionar LA RED GOERLI' });
    }

    const cuentas: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });

    this.cuenta = cuentas[0];

    return ({ success: true, msj: 'Cuenta seleccionada exitosamente.', data: this.cuenta });
  }

  async generarJWT (cuenta: string|null)
  {
    let token = null;

    if (!cuenta)
    {
      throw ({ success: false, msj: 'Token no generado, seleccione una cuenta.' });
    }

    try
    {
      token = await sign((msg) => this.web3!.eth.personal.sign(msg, cuenta, ''), '1d');
      return ({ success: true, msj: 'Token generado exitosamente.', data: token });
    }
    catch (e: any)
    {
      const msj: string = e?.message || '';

      if (msj.includes('User denied message signature'))
      {
        throw ({ success: false, msj: 'El usuario cancelo el login.' });
      }

      throw ({ success: false, msj: 'Ocurrio un error al generar el token.' });
    }
  }

  login (token: string|null): Observable<RespuestaAuth>
  {
    if (!token)
    {
      throwError({ success: false, msj: 'Token no generado.' });
    }

    const headers = new HttpHeaders().set('x-token', token!);

    return this.httpClient.post<RespuestaAuth>(`${this.url}/auth/login`, {}, { headers }).pipe(

      tap((resp: RespuestaAuth) =>
      {
        if (resp.success)
        {
          localStorage.setItem('token', resp.data!);
          return of({ success: true, msj: 'Proceso login exitoso.', data: resp.cuenta! });
        }
        else
        {
          return throwError({ success: false, msj: 'Ocurrio un error desconocido al realizar el login.' });
        }
      }),
      catchError((error: HttpErrorResponse) =>
      {
        if (Object.keys(error).length === 0)
        {
          return throwError({ success: false, msj: 'Ocurrio un error desconocido al realizar el login.' });
        }

        if (error.message.includes('404'))
        {
          return throwError({ success: false, msj: 'Servicio esta temporalmente deshabilitado, vuelva a intentarlo en unos minutos.' });
        }

        return throwError({ success: false, msj: 'Ocurrio un error desconocido al realizar el login.' });
      })
    );
  }

  validarToken ()
  {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('x-token', token);

    return this.httpClient.get<RespuestaAuth>(`${this.url}/auth/verificar-token`, { headers })
      .pipe(
        map((resp:RespuestaAuth) =>
        {
          localStorage.setItem('token', resp.data!);
          return resp.success;
        }),
        catchError((error: any) =>
        {
          return of(false);
        })
      );
  }

  logout ()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('productos');
    localStorage.removeItem('dialogo');

    return of({ success: true, msj: 'Proceso logout exitoso.', data: null });
  }
}

