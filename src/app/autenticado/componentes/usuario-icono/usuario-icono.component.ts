import { Component, Input, OnInit } from '@angular/core';
import customJazzicon from '../../utils/custom-jazzicon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-usuario-icono',
  templateUrl: './usuario-icono.component.html',
  styleUrls: ['./usuario-icono.component.css']
})
export class UsuarioIconoComponent implements OnInit
{
  @Input() cuenta: string | undefined = undefined;
  @Input() size: number = 40;
  sizePx: string = `${this.size}px`;
  identicon: SafeHtml = '';

  constructor (private readonly sanitizer: DomSanitizer)
  { }

  ngOnInit (): void
  {
    if (!this.cuenta) return;

    const iconTmp = customJazzicon(this.size, parseInt(this.cuenta.slice(2, 10), 16));
    this.sizePx = `${this.size}px`;

    if (iconTmp)
    {
      this.identicon = this.sanitizer.bypassSecurityTrustHtml(iconTmp.innerHTML);
    }
  }
}
