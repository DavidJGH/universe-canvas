import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Tokens } from '../../models/tokens.model';
import { ColorChangeInfo } from '../../models/canvas.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private readonly httpClient: HttpClient) {}

  login(
    username: string,
    password: string
  ): Observable<{ success: boolean; token?: string }> {
    return this.httpClient
      .post<Tokens>(`${environment.backendBase}/api/User/authenticate`, {
        username,
        password,
      })
      .pipe(
        catchError(() => of({ token: undefined, refreshToken: undefined })),
        map((token: Tokens) => ({ success: !!token.token, token: token.token }))
      );
  }

  updatePalette(
    palette: ColorChangeInfo[],
    startColor: number,
    token: string
  ): Observable<{ success: boolean; error: string }> {
    return this.httpClient
      .post(
        `${environment.backendBase}/api/Canvas/updatePalette`,
        { palette, startColor },
        {
          headers: { Authorization: 'Bearer ' + token },
        }
      )
      .pipe(
        catchError(err =>
          of({ success: false, error: err.error ?? err.statusText })
        ),
        map(result => ({ success: true, error: '', ...result }))
      );
  }

  updateSize(
    width: number,
    height: number,
    allowSmaller: boolean,
    token: string
  ): Observable<{ success: boolean; error: string }> {
    return this.httpClient
      .post(
        `${environment.backendBase}/api/Canvas/setSize?width=${width}&height=${height}&forceSmaller=${allowSmaller}`,
        {},
        {
          headers: { Authorization: 'Bearer ' + token },
        }
      )
      .pipe(
        catchError(err =>
          of({ success: false, error: err.error ?? err.statusText })
        ),
        map(result => ({ success: true, error: '', ...result }))
      );
  }
}
