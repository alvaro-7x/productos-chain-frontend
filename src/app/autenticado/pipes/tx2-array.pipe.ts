import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tx2Array'
})
export class Tx2ArrayPipe implements PipeTransform
{
  transform (value: string = ''): string[]
  {
    const arrayTx = value.split(',');

    return arrayTx;
  }
}
