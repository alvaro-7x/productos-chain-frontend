import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { guardarProducto, actualizarProducto, limpiarErrorProducto, asignarErrorProducto } from '../../../store/productos/productos.actions';
import { Observable, Subscription } from 'rxjs';
import { AppState } from '../../../app.reducers';
import { Producto } from '../../../store/productos/models/producto-model';
import { productoSeleccionado } from '../../../store/productos/productos.selectors';
import { abrirDialogo } from '../../../store/dialogo/dialogo.actions';
import { DialogoService } from '../../services/dialogo.service';
import { DataDialogPregunta, RespuestaDialogoProceder } from '../../interfaces/interfaces.interface';
import { TipoDialogo } from '../../constantes/constantes.constante';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit, OnDestroy {

  @ViewChild('imagenProducto') imagenProducto!: ElementRef;
  @ViewChild('inputImagen') inputImagen!: ElementRef;
  file!: File;
  dialogProceserSubscription!: Subscription;

  producto: Producto = {
    id: '',
    nombre: '',
    imagen: '',
    descripcion: '',
    destacado: false,
    creadoPor: '',
    creadoEn: 0,
  };

  extPermitidos: string [] = ['jpg','jpeg','png','gif'];
  extFile: string = 'jpg';

  maxLenDescripcion: number = 200;
  errorSizeDescripcion: boolean = false;

  maxLenNombre: number = 100;
  maxSizeFile: number = 600; // Máximo tamaño de la imagen en Kb
  sizeFile: number = 0;

  formulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(this.maxLenNombre)]],
    destacado: [false],
    descripcion: ['',[Validators.required, Validators.maxLength(this.maxLenDescripcion)]],
    imagen: [''],
  });

  estadoProductos$: Observable<any> = new Observable();
  estadoAuth$: Observable<any> = new Observable();
  estadoDialogo$: Observable<any> = new Observable();

  estadoProductos!: Subscription;


  constructor(private fb: FormBuilder, 
              private store: Store<AppState>, 
              private dialogoService: DialogoService,
              private sanitizer: DomSanitizer,
              ) { }

  ngOnInit(): void 
  {
    this.estadoProductos$=this.store.select('productos');
    this.estadoAuth$=this.store.select('auth');
    this.estadoDialogo$=this.store.select('dialogo');

    this.estadoProductos = this.store.select(productoSeleccionado).subscribe( (resp: Producto|null) => {
      if(resp!== null)
      {
        this.producto = resp;
        this.formulario.patchValue(this.producto);
      }
    });

  }

  campoEsValido(campo: string)
  {
    return this.formulario.controls[campo].errors && this.formulario.controls[campo].touched;
  }

  obtenerErrores()
  {
    const campos = this.formulario.controls;
    const formErrors: any = {};

    Object.keys(campos).map( (nombre: string) =>
    {
      const error = campos[nombre].errors; 
      if(error)
        formErrors[nombre] = {'error': error}
    });

    return formErrors;
  }

  formularioIncorrecto()
  {
    const errors = this.obtenerErrores();

    const campos = Object.keys(errors);
    
    let msjError: string | undefined = '';

    if(!this.extPermitidos.includes(this.extFile))
      msjError += `<div>Tipo de archivo no permitido, solo se permite: ${ this.extPermitidos.join(', ') }.</div>`;

    if(this.sizeFile > this.maxSizeFile)
      msjError += `<div>El tamaño máximo permitido para la imagen es de ${this.maxSizeFile} Kb.</div>`;

    if(campos.includes('descripcion'))
      msjError += `<div>La descripción es requerida y debe tener máximo ${this.maxLenDescripcion} caracteres.</div>`;

    if(campos.includes('nombre'))
      msjError += `<div>El nombre es requerido y debe tener máximo ${this.maxLenNombre} caracteres.</div>`;

    if(msjError)
    {
      const errorForm: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(msjError);
      this.store.dispatch(asignarErrorProducto({error: errorForm}));
    }

    return msjError? true: false;
  }

  enviarFormulario(event: any)
  {
    event.preventDefault();
    
    this.retirarError();

    if(this.formularioIncorrecto())
      return;

    const producto = {
      ...this.formulario.value,
    }

    const id = this.producto.id === ''? null:this.producto.id;
    
    const tipo = this.producto.id === ''? TipoDialogo.CREAR: TipoDialogo.ACTUALIZAR;

    if(this.dialogProceserSubscription)
      this.dialogProceserSubscription.unsubscribe();

    const data: DataDialogPregunta = {redirigir: true, url: 'wallet/productos', variosProductos: false};

    this.store.dispatch(abrirDialogo({tipo: tipo, producto: producto, id:id, data:data }));

    this.dialogProceserSubscription = this.dialogoService.getDialogo().componentInstance.onProceder.subscribe( (resp: RespuestaDialogoProceder) =>
    {
      if(resp.proceder === true)
      {
        if(id !== null)
          this.store.dispatch( actualizarProducto({
            producto: producto,
            imagen: this.file,
            id: id,
            gasLimit:resp.gasLimit,
            gasPrice: resp.gasPrice,
          }));
        else
          this.store.dispatch( guardarProducto({
            producto: producto,
            imagen: this.file,
            gasLimit:resp.gasLimit,
            gasPrice: resp.gasPrice,
          }));
      }

      if(resp.proceder === false)
      {
        this.retirarError();
      }
    });
  }

  cambiarImagen(event: any)
  {
    if (event.target.files.length > 0)
    {
      const tmpFile = event.target.files[0];

      if(!tmpFile)
        return;
      
      const [, ext] = tmpFile.type.split('/');

      this.extFile = ext;

      this.sizeFile = Math.round(tmpFile.size/1024);

      if(this.formularioIncorrecto())
      {
        this.sizeFile = 0;
        this.extFile = 'jpg';
        return;
      }

      this.file = tmpFile;

      const fileReader:FileReader = new FileReader();

      fileReader.onloadend = (e) => {
        this.imagenProducto.nativeElement.src = fileReader.result;
      }

      fileReader.readAsDataURL(this.file);
    }
  }

  retirarError()
  {
    this.store.dispatch(limpiarErrorProducto());
  }

  verificarLimite()
  {
    if(this.formulario.value.descripcion>this.maxLenDescripcion)
      this.errorSizeDescripcion = true;
    else
      this.errorSizeDescripcion = false;
  }

  cancelar()
  {
    this.retirarError();
  }

  ngOnDestroy()
  {
    this.estadoProductos.unsubscribe();
    
    if(this.dialogProceserSubscription)
      this.dialogProceserSubscription.unsubscribe();
  }


}
