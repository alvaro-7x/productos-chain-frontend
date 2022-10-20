import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './paginas/productos/productos.component';
import { Pagina404Component } from '../shared/pagina404/pagina404.component';
import { CrearProductoComponent } from './paginas/crear-producto/crear-producto.component';
import { DashboardComponent } from './paginas/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'productos',
        pathMatch: 'full',
        component: ProductosComponent
      },
      {
        path: 'producto',
        pathMatch: 'full',
        component: CrearProductoComponent
      }
    ]
  },
  {
    path: '**',
    component: Pagina404Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaginasProtegidasRoutingModule
{ }
