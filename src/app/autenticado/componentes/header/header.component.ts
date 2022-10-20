import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { conectarWallet, desconectarWallet } from '../../../store/auth/auth.actions';
import { usuarioLogueado } from '../../../store/auth/auth.selectors';
import { Observable, Subscription } from 'rxjs';
import { AppState } from '../../../app.reducers';

import { misProductos } from '../../../store/productos/productos.selectors';
import { deseleccionarTodosProductos, limpiarErrorProducto, crearProducto, eliminarVariosProductos } from '../../../store/productos/productos.actions';

import { DialogoService } from '../../services/dialogo.service';
import { abrirDialogo } from '../../../store/dialogo/dialogo.actions';

import { DataDialogPregunta } from '../../interfaces/interfaces.interface';
import { TipoDialogo } from '../../constantes/constantes.constante';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy
{
  @ViewChild('btnLogout') btnLogout!: HTMLElement;
  @Input() estadoSocket: boolean = false;

  estadoProductos$: Observable<any> = new Observable();
  misProductos$: Observable<any> = new Observable();

  estadoAuth$: Observable<any> = new Observable();
  estadoDialogo$: Observable<any> = new Observable();
  dialogProceserSubscription: Subscription | undefined = undefined;
  usuarioLogueadoSubscription: Subscription | undefined = undefined;

  constructor (
    private readonly store: Store<AppState>,
    private readonly dialogoService: DialogoService
  )
  { }

  ngOnInit (): void
  {
    this.estadoProductos$ = this.store.select('productos');
    this.misProductos$ = this.store.select(misProductos);
    this.estadoAuth$ = this.store.select('auth');
    this.estadoDialogo$ = this.store.select('dialogo');

    this.usuarioLogueadoSubscription = this.store.select(usuarioLogueado).subscribe((resp: boolean) =>
    {
      if (!resp)
      {
        this.desconectarWallet();
      }
    });
  }

  eliminarProductosSeleccionados (ids: string[])
  {
    if (this.dialogProceserSubscription != null)
    {
      this.dialogProceserSubscription.unsubscribe();
    }

    const data: DataDialogPregunta = { redirigir: false, url: null, variosProductos: true };
    this.store.dispatch(abrirDialogo({ tipo: TipoDialogo.ELIMINAR, producto: null, id: ids, data }));

    this.dialogProceserSubscription = this.dialogoService.getDialogo().componentInstance.onProceder.subscribe((resp: any) =>
    {
      if (resp.proceder === true)
      {
        this.store.dispatch(eliminarVariosProductos({ id: ids, gasPrice: resp.gasPrice }));
      }

      if (resp.proceder === false)
      {
        this.limpiarError();
      }
    });
  }

  crearProducto ()
  {
    this.store.dispatch(crearProducto());
  }

  limpiarError ()
  {
    this.store.dispatch(limpiarErrorProducto());
  }

  desconectarWallet ()
  {
    this.store.dispatch(desconectarWallet());
  }

  conectarWallet ()
  {
    this.store.dispatch(conectarWallet());
  }

  @HostListener('window:keydown.escape', ['$event'])
  keyEvent (event: KeyboardEvent)
  {
    this.store.dispatch(deseleccionarTodosProductos());
  }

  ngOnDestroy ()
  {
    if (this.dialogProceserSubscription != null)
    {
      this.dialogProceserSubscription.unsubscribe();
    }

    if (this.usuarioLogueadoSubscription != null)
    {
      this.usuarioLogueadoSubscription.unsubscribe();
    }
  }
}
