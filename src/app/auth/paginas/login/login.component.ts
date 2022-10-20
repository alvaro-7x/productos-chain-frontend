import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { usuarioLogueado } from '../../../store/auth/auth.selectors';
import { AppState } from '../../../app.reducers';
import { conectarWallet } from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy
{
  usuarioLogueadoSubscription: Subscription|undefined = undefined;
  estadoAuth$: Observable<any> = new Observable();

  constructor (private store: Store<AppState>, private router: Router)
  { }

  ngOnInit (): void
  {
    this.estadoAuth$ = this.store.select('auth');

    this.usuarioLogueadoSubscription = this.store.select(usuarioLogueado).subscribe(async (resp: boolean) =>
    {
      if (resp)
      {
        await this.router.navigate(['wallet/productos'], { replaceUrl: true });
      }
    });
  }

  conectarWallet ()
  {
    this.store.dispatch(conectarWallet());
  }

  ngOnDestroy ()
  {
    if (this.usuarioLogueadoSubscription)
    {
      this.usuarioLogueadoSubscription.unsubscribe();
    }
  }
}
