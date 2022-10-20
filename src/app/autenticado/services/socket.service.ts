import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService
{
  socket: any = undefined;

  constructor ()
  {
    this.socket = io(environment.url, { timeout: 3000, extraHeaders: { 'x-token': localStorage.getItem('token') || '' } });
  }

  emit (evento: string, data: any)
  {
    if (this.socket)
    {
      this.socket.emit(evento, data);
    }
  }

  getSocket ()
  {
    return this.socket;
  }
}
