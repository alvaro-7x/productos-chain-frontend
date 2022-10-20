import { HttpContextToken } from '@angular/common/http';

export const TOKEN_REQUERIDO = new HttpContextToken(() => false);
