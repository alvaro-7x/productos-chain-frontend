import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPreguntaComponent } from '../componentes/dialog-pregunta/dialog-pregunta.component';
import { DataDialogPregunta } from '../interfaces/interfaces.interface';

@Injectable({
  providedIn: 'root'
})

export class DialogoService
{
  dialogoRef: any | null = null;
  constructor (private readonly matDialog: MatDialog)
  { }

  abrirDialogPregunta (data: DataDialogPregunta)
  {
    this.cerrarDialogo();
    this.dialogoRef = this.matDialog.open(DialogPreguntaComponent,
      {
        data,
        autoFocus: true,
        disableClose: true,
        closeOnNavigation: true
      });
  }

  getDialogo ()
  {
    return this.dialogoRef;
  }

  cerrarDialogo ()
  {
    if (this.dialogoRef)
    {
      this.dialogoRef.close();
    }
  }
}
