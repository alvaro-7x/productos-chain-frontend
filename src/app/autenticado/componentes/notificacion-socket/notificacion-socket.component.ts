import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-notificacion-socket',
  templateUrl: './notificacion-socket.component.html',
  styleUrls: ['./notificacion-socket.component.css']
})
export class NotificacionSocketComponent implements OnInit
{
  cantidadTx: number = 0;

  textoTx: { [k: string]: string } = {
    '=0': 'Transacciones',
    '=1': 'Transacción',
    'other': 'Transacciones'
  };

  textoRealizada: { [k: string]: string } = {
    '=0': 'realizadas',
    '=1': 'realizada',
    'other': 'realizadas'
  };

  urlTransaccion: string = environment.TRANSACCION;

  constructor (@Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBar: MatSnackBar)
  { }

  ngOnInit (): void
  {
    this.cantidadTx = this.data.tx.split(',').length;
  }
}
