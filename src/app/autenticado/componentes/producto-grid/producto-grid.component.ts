import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Producto } from '../../../store/productos/models/producto-model';

@Component({
  selector: 'app-producto-grid',
  templateUrl: './producto-grid.component.html',
  styleUrls: ['./producto-grid.component.css']
})
export class ProductoGridComponent implements OnInit
{
  @Input() productos: Producto[] = [];
  @Input() productosSeleccionados: boolean = false;
  @Input() idProducto: string | undefined = undefined;
  @Output() onSeleccionarCard: EventEmitter<string> = new EventEmitter<string>();
  @Output() onEliminarProducto: EventEmitter<string | undefined> = new EventEmitter<string | undefined>();
  @Output() onEditarProducto: EventEmitter<string | undefined> = new EventEmitter<string | undefined>();

  constructor ()
  { }

  ngOnInit (): void
  { }

  seleccionarCard (id: string)
  {
    this.onSeleccionarCard.emit(id);
  }

  eliminarProducto (id: string)
  {
    this.onEliminarProducto.emit(id);
  }

  editarProducto (id: string)
  {
    this.onEditarProducto.emit(id);
  }
}
