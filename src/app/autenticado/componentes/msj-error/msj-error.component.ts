import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-msj-error',
  templateUrl: './msj-error.component.html',
  styleUrls: ['./msj-error.component.css']
})
export class MsjErrorComponent implements OnInit
{
  @Input() visible: boolean = false;
  @Input() error: string = '';
  @Output() onCerrarMensajeError: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor ()
  { }

  ngOnInit (): void
  {
  }

  cerrarMsj ()
  {
    this.onCerrarMensajeError.emit(true);
  }
}
