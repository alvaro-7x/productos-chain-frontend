import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { desconectarWallet, validarToken } from '../../../store/auth/auth.actions';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from '../../services/socket.service';
import { actualizarProductoSuccess, eliminarProductoSuccess, eliminarVariosProductosSuccess, guardarProductoSuccess, listarProductos } from '../../../store/productos/productos.actions';
import { RespuestaSocket } from '../../interfaces/interfaces.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificacionSocketComponent } from '../../componentes/notificacion-socket/notificacion-socket.component';

declare let window: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

	routerEventsSubscription: Subscription|undefined = undefined;

	// Eventos Metamask
	accountsChanged: Function;
	chainChanged: Function;
	disconnect: Function;

	// Eventos Socket
	productoCreado: Function;
	productoActualizado: Function;
	productoEliminado: Function;
	productosEliminados: Function;
	socketConectado: Function;
	socketDesconectado: Function;

	estadoSocket: boolean = false;

  constructor( private store: Store,
  						 private router: Router,
  						 private socketService: SocketService,
  						 private snackBar: MatSnackBar )
  {

  	this.routerEventsSubscription = this.router.events.subscribe((event: any) => 
  	{
			if (event instanceof NavigationStart)
				this.store.dispatch(validarToken());
  	});


  	// Eventos Metamask
		this.accountsChanged = (accounts: any) =>
		{
			this.cambioEnWallet();
		}
		this.chainChanged = (accounts: any) =>
		{
			this.cambioEnWallet();
		}
		this.disconnect = (error: any) =>
		{
			// console.error(error);
		}

		// Eventos Socket
		this.productoCreado = (resp: RespuestaSocket) => 
		{
			this.store.dispatch(guardarProductoSuccess({producto: resp.data, balance: resp.balance }));
			this.notificarUsuarios(resp.tx, 'Creación');
		};
		this.productoActualizado = (resp: RespuestaSocket) => 
		{
			this.store.dispatch(actualizarProductoSuccess({producto: resp.data, balance: resp.balance }));
			this.notificarUsuarios(resp.tx, 'Actualización');
		};
		this.productoEliminado = (resp: RespuestaSocket) => 
		{
			this.store.dispatch(eliminarProductoSuccess({id: resp.data, balance: resp.balance }));
			this.notificarUsuarios(resp.tx, 'Eliminación');
		};
		this.productosEliminados = (resp: RespuestaSocket) => 
		{
			this.store.dispatch(eliminarVariosProductosSuccess({id: resp.data, balance: resp.balance }));
			this.notificarUsuarios(resp.tx, 'Eliminaciones');
		};
		this.socketConectado = () => 
		{
			this.estadoSocket = true;
			this.store.dispatch(listarProductos());
		};

		this.socketDesconectado = () => 
		{
			this.estadoSocket = false;
		};

  }

  cambioEnWallet()
  {
		this.store.dispatch(desconectarWallet());
  }

  ngOnInit(): void 
  {
  	// Metamask
  	if(window.ethereum)
  	{
			window.ethereum.on('accountsChanged', this.accountsChanged, true);
			window.ethereum.on('chainChanged', this.chainChanged), true;
			window.ethereum.on('disconnect',  this.disconnect, true);
  	}

		// Socket
		if(this.socketService.getSocket())
		{
			this.socketService.getSocket().on('connect', this.socketConectado);
			this.socketService.getSocket().on('disconnect', this.socketDesconectado);
			this.socketService.getSocket().on('producto-creado', this.productoCreado);
			this.socketService.getSocket().on('producto-actualizado', this.productoActualizado);
			this.socketService.getSocket().on('producto-eliminado', this.productoEliminado);
			this.socketService.getSocket().on('productos-eliminados', this.productosEliminados);
		}

  }

  notificarUsuarios(tx: string, tipoAccion: string)
  {

  	this.snackBar.dismiss();

	  this.snackBar.openFromComponent(NotificacionSocketComponent, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
	    data:
	    {
	      tx: tx,
	      tipoAccion: tipoAccion
	    }
	  });
  }

  ngOnDestroy()
  {
  	if(!window.ethereum)
  		return;

		window.ethereum.removeListener('accountsChanged', this.accountsChanged, true);
		window.ethereum.removeListener('chainChanged', this.chainChanged, true);
		window.ethereum.removeListener('disconnect', this.disconnect, true);

		window.location.reload();

		if(this.routerEventsSubscription)
			this.routerEventsSubscription.unsubscribe();
  }

}
