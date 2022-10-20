import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina404',
  templateUrl: './pagina404.component.html',
  styleUrls: ['./pagina404.component.css']
})
export class Pagina404Component implements OnInit
{
  constructor (private router: Router)
  { }

  ngOnInit (): void
  { }

  async volver ()
  {
    await this.router.navigate(['/wallet/productos'], { replaceUrl: true });
    window.location.reload();
  }
}
