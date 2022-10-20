import { Component, EventEmitter, Input, ViewChild, ElementRef, OnInit, Output, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-producto-buscar',
  templateUrl: './producto-buscar.component.html',
  styleUrls: ['./producto-buscar.component.css']
})
export class ProductoBuscarComponent implements OnInit, AfterViewInit
{
  @ViewChild('inputBuscar') inputBuscar!: ElementRef<HTMLInputElement>;
  @Input() resultadoCantidad: number = 0;
  @Output() onTerminoBusqueda: EventEmitter<string> = new EventEmitter<string>();
  buscar: string | undefined = undefined;
  buscando: boolean = false;

  detalleBusqueda: { [k: string]: string } = {
    '=0': 'No hay coincidencias.',
    '=1': '1 coincidencia.',
    'other': '# coincidencias.'
  };

  constructor ()
  { }

  ngOnInit (): void
  { }

  ngAfterViewInit ()
  {
    this.inputBuscar.nativeElement.focus();
  }

  buscarResultados ()
  {
    if (this.buscar)
    {
      this.onTerminoBusqueda.emit(this.buscar);
      this.buscando = true;
    }
  }

  buscarLimpiar ()
  {
    this.buscar = undefined;
    this.buscando = false;
  }
}
