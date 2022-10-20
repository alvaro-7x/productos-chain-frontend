import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-brujula',
  templateUrl: './brujula.component.html',
  styleUrls: ['./brujula.component.css']
})
export class BrujulaComponent implements OnInit, AfterViewInit
{
  @ViewChild('myCanvas') myCanvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D | null;

  width: number = 400;
  height: number = 400;
  diametro: number = 400;
  radio: number = this.diametro / 2;

  centroX = this.width / 2;
  centroY = this.height / 2;

  colorBase: string = '#F8F1F1';
  colorBorde: string = '#2c5871';
  colorSombra: string = '#bfcfd6';
  colorCirculo: string = '#e6f1ff';
  colorLetras: string = '#2c5871';
  colorManecillaAzul: string = '#66c1ff';
  colorManecillaRoja: string = '#ff4c4c';
  colorCirculoManecillas: string = '#555a66';
  colorDetalleBrujula1: string = '#2c5871';
  colorDetalleBrujula2: string = '#bfcfd6';

  anguloMouse: number = 234;

  constructor ()
  { }

  ngOnInit (): void
  {
  }

  ngAfterViewInit (): void
  {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');

    this.initGraficas();
  }

  initGraficas ()
  {
    if (!this.ctx)
    {
      return;
    }

    this.limpiarCanvas(this.ctx);
    this.dibujarCirculo(this.ctx);
    this.sombra(this.ctx);
    this.dibujarBorde(this.ctx);
    this.dibujarPuntosCardinales(this.ctx);
    this.dibujarDetallesBrujula(this.ctx);
    this.dibujarManecillas(this.ctx);
  }

  limpiarCanvas (ctx: CanvasRenderingContext2D)
  {
    ctx.clearRect(0, 0, this.width, this.height);
  }

  dibujarForma (ctx: CanvasRenderingContext2D, radio: number, inset: number, n: number, color: string)
  {
    ctx.beginPath();
    ctx.save();
    ctx.translate(this.centroX, this.centroY);

    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    ctx.moveTo(0, 0 - radio);

    for (let i = 0; i < n; i++)
    {
      ctx.rotate(Math.PI / n);
      ctx.lineTo(0, 0 - (radio * inset));

      ctx.rotate(Math.PI / n);
      ctx.lineTo(0, 0 - radio);
    }

    ctx.stroke();
    ctx.fill();

    ctx.restore();
    ctx.closePath();
  }

  dibujarDetallesBrujula (ctx: CanvasRenderingContext2D)
  {
    this.dibujarForma(ctx, 100, 0.35, 8, this.colorDetalleBrujula1);
    this.dibujarForma(ctx, 100, 0.35, 4, this.colorDetalleBrujula2);
  }

  sombra (ctx: CanvasRenderingContext2D)
  {
    ctx.beginPath();
    ctx.arc(this.centroX, this.centroY, 182, 1.5 * (Math.PI), 0.5 * (Math.PI));
    ctx.bezierCurveTo(400, 400 - 20, 400, +20, 200, 20);
    ctx.fillStyle = this.colorSombra;
    ctx.fill();
    ctx.closePath();
  }

  dibujarBorde (ctx: CanvasRenderingContext2D)
  {
    ctx.fillStyle = this.colorBorde;
    ctx.strokeStyle = this.colorBorde;

    const borde = this.radio - 20;

    ctx.beginPath();
    for (let i = this.radio; i > borde; i--)
    {
      ctx.arc(this.centroX, this.centroY, i, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.closePath();
  }

  dibujarCirculo (ctx: CanvasRenderingContext2D)
  {
    ctx.fillStyle = this.colorCirculo;
    ctx.strokeStyle = this.colorCirculo;

    ctx.beginPath();
    ctx.arc(this.centroX, this.centroY, this.radio - 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  puntosCardinales (ctx: CanvasRenderingContext2D, puntosCardinales:string[], fontSize: number, bold: boolean)
  {
    const fontBold = bold ? 'bold' : '';
    ctx.font = `${fontBold} ${fontSize}px Ubuntu`;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = this.colorLetras;
    ctx.strokeStyle = this.colorLetras;

    ctx.beginPath();
    const puntos:string[] = puntosCardinales;
    const length = puntos.length;

    for (let i = 0; i < length; i++)
    {
      ctx.fillText(puntos[i],
        this.radio + this.radio * 0.75 * Math.sin((i) * 2 * Math.PI / length),
        this.radio - (this.radio * 0.75 * Math.cos((i) * 2 * Math.PI / length))
      );
    }
    ctx.closePath();
  }

  dibujarPuntosCardinales (ctx: CanvasRenderingContext2D)
  {
    const puntosCardinales = ['N', 'E', 'S', 'O'];
    const subPuntosCardinales = ['', 'NE', '', 'SE', '', 'SO', '', 'NO'];
    this.puntosCardinales(ctx, puntosCardinales, 50, true);
    this.puntosCardinales(ctx, subPuntosCardinales, 15, true);
  }

  @HostListener('window:mousemove', ['$event'])
  moverManecillas (event: MouseEvent)
  {
    const rect = this.myCanvas.nativeElement.getBoundingClientRect();

    // const x = event.clientX;
    // const y = event.clientY;

    const x = (event.clientX - rect.left) / (rect.right - rect.left) * this.width;
    const y = (event.clientY - rect.top) / (rect.bottom - rect.top) * this.height;

    const x0 = x - this.centroX;
    const y0 = y - this.centroY;

    const m = (x0 < 0 && y0 < 0) || (x0 > 0 && y0 > 0) ? y0 / x0 : x0 / y0;

    let a = Math.atan(Math.abs(m)) * (180 / Math.PI);

    if (x0 > 0 && y0 > 0)
    {
      a = 270 + a;
    }
    if (x0 >= 0 && y0 <= 0)
    {
      a = 180 + a;
    }
    if (x0 < 0 && y0 < 0)
    {
      a = 90 + a;
    }
    if (x0 < 0 && y0 > 0)
    {
      a = 0 + a;
    }

    this.anguloMouse = a;

    this.initGraficas();
  }

  dibujarManecillas (ctx: CanvasRenderingContext2D)
  {
    let angulo = this.anguloMouse;

    if (angulo > 359)
    {
      angulo = angulo % 360;
    }

    if (angulo < 1)
    {
      angulo = 360;
    }

    ctx.beginPath();
    ctx.save();

    ctx.translate(this.centroX, this.centroY);

    // Rotar manecillas
    ctx.rotate(angulo * Math.PI / 180);

    // manecilla azul
    ctx.fillStyle = this.colorManecillaAzul;
    ctx.strokeStyle = this.colorManecillaAzul;
    ctx.moveTo(0 - 20, 0);

    ctx.lineTo(0 - 2, 120);
    ctx.lineTo(0 + 2, 120);

    ctx.lineTo(0 + 20, 0);
    ctx.fill();

    // manecilla roja
    ctx.beginPath();
    ctx.fillStyle = this.colorManecillaRoja;
    ctx.strokeStyle = this.colorManecillaRoja;
    ctx.moveTo(0 - 20, 0);

    ctx.lineTo(0 - 2, -120);
    ctx.lineTo(0 + 2, -120);

    ctx.lineTo(0 + 20, 0);
    ctx.fill();

    // circulo del centro
    ctx.beginPath();
    ctx.fillStyle = this.colorCirculoManecillas;
    ctx.strokeStyle = this.colorCirculoManecillas;
    ctx.arc(0, 0, 21, 0, Math.PI * 2, true);
    ctx.fill();

    // Reiniciar la matriz de transformacines a la matriz identidad
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.restore();
    ctx.closePath();
  }
}
