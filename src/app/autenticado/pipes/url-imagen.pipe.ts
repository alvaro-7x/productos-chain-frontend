import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlimagen'
})
export class UrlImagenPipe implements PipeTransform
{
  transform (url: string): string
  {
    return (url === '') ? 'assets/img/default.png' : url;
  }
}
