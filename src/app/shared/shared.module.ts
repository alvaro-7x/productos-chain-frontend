import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { Pagina404Component } from './pagina404/pagina404.component';

import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrujulaComponent } from './brujula/brujula.component';

@NgModule({
  declarations: [
    Pagina404Component,
    BrujulaComponent
  ],

  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,

    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule
{ }
