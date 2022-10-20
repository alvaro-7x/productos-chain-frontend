import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducers';
import { Observable, Subscription } from 'rxjs';

import { iniciarBusquedaProducto, terminarBusquedaProducto, deseleccionarTodosProductos, editarProducto, eliminarProducto, listarProductos, seleccionarProducto, limpiarErrorProducto } from '../../../store/productos/productos.actions';

import { productos, productosCargados } from '../../../store/productos/productos.selectors';

import { abrirDialogo} from '../../../store/dialogo/dialogo.actions';
import { DialogoService } from '../../services/dialogo.service';
import { DataDialogPregunta, RespuestaDialogoProceder } from '../../interfaces/interfaces.interface';
import { TipoDialogo } from '../../constantes/constantes.constante';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, OnDestroy
{

  //0: vista grid
  //1: vista filas
  tipoVista: number = 0;
  productos$: Observable<any> = new Observable();
  estadoProductos$: Observable<any> = new Observable();
  estadoDialogo$: Observable<any> = new Observable();

  dialogProcesarSubscription: Subscription|undefined = undefined;
  idProducto: string|undefined = undefined;
  loadedSubscription: Subscription|undefined = undefined;

  mostrarBuscar: boolean = false;
  buscar: string|undefined = undefined;

  nroIntentosCargarProductos: number = 0;
  maxIntentosCargarProductos: number = 1;

  constructor(private store: Store<AppState>,
              private dialogoService: DialogoService)
  { }

  ngOnInit(): void 
  {
    this.loadedSubscription = this.store.select(productosCargados).subscribe( (resp: boolean | null) => 
    {
      if(resp === false)
      {
        this.intentarCargarProductos();
      }
    });

    this.estadoProductos$=this.store.select('productos');
    this.estadoDialogo$=this.store.select('dialogo');
    this.productos$=this.store.select(productos);
  }

  intentarCargarProductos()
  {
    if(this.nroIntentosCargarProductos < this.maxIntentosCargarProductos)
    {
      this.nroIntentosCargarProductos ++;
      this.store.dispatch(listarProductos());
    }
  }

  cargarProductos()
  {
    this.nroIntentosCargarProductos = 0;
    this.intentarCargarProductos();
  }

  seleccionarCard(id: string)
  {
    this.store.dispatch(seleccionarProducto({id:id}));
  }

  deseleccionarAllCards()
  {
    this.store.dispatch(deseleccionarTodosProductos());
  }

  cambiarVista(tipoVista: number)
  {
    this.tipoVista = tipoVista
    this.retirarError();
  }

  editarProducto(id: string|undefined)
  {
    if(id === undefined) return;

    this.store.dispatch(editarProducto({id}));
  }
  
  eliminarProducto(id: string|undefined)
  {
    if(id === undefined) return;

    this.idProducto = id;

    if(this.dialogProcesarSubscription)
      this.dialogProcesarSubscription.unsubscribe();

    const data: DataDialogPregunta = {redirigir: false, url: null, variosProductos: false};

    this.store.dispatch(abrirDialogo({tipo: TipoDialogo.ELIMINAR, producto: null, id:id, data: data }));

    if(this.dialogoService.getDialogo)
    {
      this.dialogProcesarSubscription =  this.dialogoService.getDialogo().componentInstance.onProceder.subscribe( (resp: RespuestaDialogoProceder) =>
      {
        if(resp.proceder === true)
        {
          this.store.dispatch(eliminarProducto({id, gasLimit:resp.gasLimit, gasPrice: resp.gasPrice}));
        }

        if(resp.proceder === false)
        {
          this.idProducto = undefined;
          this.retirarError();
        }
      });
    }
  }

  retirarError()
  {
    this.store.dispatch(limpiarErrorProducto());
  }

  resultadosBusqueda(dato: string)
  {
    this.store.dispatch(iniciarBusquedaProducto({buscar: dato}));
  }

  buscarToogle()
  {
    this.mostrarBuscar = !this.mostrarBuscar;

    if(!this.mostrarBuscar)
      this.terminarBusqueda();
  }

  terminarBusqueda()
  {
    this.store.dispatch(terminarBusquedaProducto());
  }


  ngOnDestroy()
  {
    this.nroIntentosCargarProductos = 0;

    if(this.dialogProcesarSubscription)
      this.dialogProcesarSubscription.unsubscribe();

    if(this.loadedSubscription)
      this.loadedSubscription.unsubscribe();
  }

}
