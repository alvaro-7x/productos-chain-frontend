import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idformat'
})
export class IdPipe implements PipeTransform
{
  transform (value: string = ''): string
  {
    return (!value) ? '' : value.toLowerCase().substr(0, 5) + '...' + value.toLowerCase().substr(-4);
  }
}
