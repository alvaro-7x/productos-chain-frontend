import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginasProtegidasRoutingModule } from './autenticado-routing.module';
import { ProductosComponent } from './paginas/productos/productos.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { CrearProductoComponent } from './paginas/crear-producto/crear-producto.component';
import { DashboardComponent } from './paginas/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UrlImagenPipe } from './pipes/url-imagen.pipe';
import { IdPipe } from './pipes/id.pipe';
import { DialogPreguntaComponent } from './componentes/dialog-pregunta/dialog-pregunta.component';
import { productosReducer } from '../store/productos/productos.reducer';
import { dialogoReducer } from '../store/dialogo/dialogo.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ProductosEffects } from '../store/productos/productos.effects';
import { DialogoEffects } from '../store/dialogo/dialogo.effects';
import { ProductoGridComponent } from './componentes/producto-grid/producto-grid.component';
import { ProductoListComponent } from './componentes/producto-list/producto-list.component';
import { UsuarioIconoComponent } from './componentes/usuario-icono/usuario-icono.component';
import { HeaderComponent } from './componentes/header/header.component';
import { ProductoBuscarComponent } from './componentes/producto-buscar/producto-buscar.component';
import { CargandoComponent } from './componentes/cargando/cargando.component';
import { MsjErrorComponent } from './componentes/msj-error/msj-error.component';
import { Tx2ArrayPipe } from './pipes/tx2-array.pipe';
import { NotificacionSocketComponent } from './componentes/notificacion-socket/notificacion-socket.component';

@NgModule({
  declarations: [
    ProductosComponent,
    CrearProductoComponent,
    DashboardComponent,
    UrlImagenPipe,
    IdPipe,
    DialogPreguntaComponent,
    ProductoGridComponent,
    ProductoListComponent,
    UsuarioIconoComponent,
    HeaderComponent,
    ProductoBuscarComponent,
    CargandoComponent,
    MsjErrorComponent,
    Tx2ArrayPipe,
    NotificacionSocketComponent,
  ],
  imports: [
    CommonModule,
    PaginasProtegidasRoutingModule,
    SharedModule,
    MaterialModule,
    
    FormsModule,
    ReactiveFormsModule,

    StoreModule.forFeature('productos',productosReducer),
    StoreModule.forFeature('dialogo',dialogoReducer),
    EffectsModule.forFeature([ProductosEffects, DialogoEffects]),
  ]
})
export class PaginasProtegidasModule { }
