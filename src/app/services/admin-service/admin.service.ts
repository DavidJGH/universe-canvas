import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Tokens } from '../../models/tokens.model';

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
      .post<Tokens>(environment.backendBase + '/api/User/authenticate', {
        username,
        password,
      })
      .pipe(
        catchError(() => of({ token: undefined, refreshToken: undefined })),
        map((token: Tokens) => ({ success: !!token.token, token: token.token }))
      );
  }
}
