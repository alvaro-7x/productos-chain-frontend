import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import { AppState } from '../../../app.reducers';

import { cerrarDialogo, procesandoAccionEnDialogo } from '../../../store/dialogo/dialogo.actions';
import { DataDialogPregunta, RespuestaDialogoProceder } from '../../interfaces/interfaces.interface';
import { gasEstimado, procesoExitoso } from '../../../store/dialogo/dialogo.selector';

@Component({
  selector: 'app-dialog-pregunta',
  templateUrl: './dialog-pregunta.component.html',
  styleUrls: ['./dialog-pregunta.component.css']
})

export class DialogPreguntaComponent implements OnInit, OnDestroy
{
  @Output() onProceder: EventEmitter<RespuestaDialogoProceder | boolean> = new EventEmitter();
  estadoAuth$: Observable<any> = new Observable();
  estadoDialogo$: Observable<any> = new Observable();

  urlTransaccion: string = environment.TRANSACCION;
  gasLimitTmp: number = 0;
  error: string | undefined = undefined;
  gasLimit: number = environment.GAS_LIMIT;
  gasPrice: number = environment.GAS_PRICE;
  estimatedGasFee: number = 0.0;

  gasSubscription: Subscription | null = null;
  procesoExitosoSubscription: Subscription | null = null;

  procesoExitosoDialogo: boolean = false;
  cantidadProductos: number = 1;

  constructor (private readonly matDialogRef: MatDialogRef<DialogPreguntaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialogPregunta,
    private readonly store: Store<AppState>,
    private readonly router: Router
  )
  {
    this.calcularEstimadeGasFee();
  }

  ngOnInit (): void
  {
    this.estadoAuth$ = this.store.select('auth');
    this.estadoDialogo$ = this.store.select('dialogo');

    this.gasSubscription = this.store.select(gasEstimado).subscribe((resp: number) =>
    {
      this.gasLimit = resp;
      this.gasLimitTmp = resp;
      this.calcularEstimadeGasFee();
    });

    this.procesoExitosoSubscription = this.store.select(procesoExitoso).subscribe((resp: boolean) =>
    {
      this.procesoExitosoDialogo = resp;
    });
  }

  verificarGas ()
  {
    this.error = undefined;

    if (this.gasLimit === undefined || this.gasLimit < this.gasLimitTmp)
    {
      this.error = `El gas limit debe ser al menos de ${this.gasLimitTmp}`;
      return;
    }

    if (this.gasPrice === undefined || this.gasPrice <= 0)
    {
      this.gasPrice = 0;
      this.error = 'El gas price debe ser mayor a 0 (cero)';
    }
  }

  proceder ()
  {
    if (this.error)
    {
      return;
    }

    const respuestaDialogo: RespuestaDialogoProceder = {
      proceder: true,
      gasLimit: this.gasLimit,
      gasPrice: this.gasPrice
    };
    this.onProceder.emit(respuestaDialogo);
    this.store.dispatch(procesandoAccionEnDialogo());
  }

  calcularEstimadeGasFee ()
  {
    this.verificarGas();
    this.estimatedGasFee = ((this.gasPrice * Math.pow(10, 9)) * this.gasLimit) / Math.pow(10, 18);
  }

  soloNumeros (event: KeyboardEvent)
  {
    return (event.charCode >= 48 && event.charCode < 58);
  }

  async cerrar ()
  {
    this.matDialogRef.close();
    this.store.dispatch(cerrarDialogo());

    const respuestaDialogo: RespuestaDialogoProceder = {
      proceder: false,
      gasLimit: 0,
      gasPrice: 0
    };

    this.onProceder.emit(respuestaDialogo);

    if (this.procesoExitosoDialogo && this.data.redirigir)
    {
      await this.router.navigate([this.data.url], { replaceUrl: true });
    }
  }

  ngOnDestroy ()
  {
    if (this.gasSubscription != null)
    {
      this.gasSubscription.unsubscribe();
    }

    if (this.procesoExitosoSubscription != null)
    {
      this.procesoExitosoSubscription.unsubscribe();
    }
  }
}
