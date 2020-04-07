import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, empty } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    req = this.addAuthHeader(req);

    // call next() and handle the response
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);

        if (error.status === 401) {
          // 401 error
          // refresh the access token
          this.refreshAccessToken()
            .pipe(
              switchMap(() => {
                console.log('switch map');
                req = this.addAuthHeader(req);
                return next.handle(req);
              }),
              catchError((err: any) => {
                console.log('error refresh token ' + err);
                this.authService.logout();
                return empty();
              })
            );
        }
        this.authService.logout();
        return throwError(error);
      })
    );
  }

  refreshAccessToken() {
    // send req to refresh access token
    return this.authService.getNewAccessToken().pipe(
      tap(() => {
        console.log('Access Token Refreshed!');
      })
    );
  }

  addAuthHeader(req: HttpRequest<any>) {
    // get access token
    const token = this.authService.getAccessToken();

    if (token) {
      // append thge access token to the req header
      return req.clone({
        setHeaders: {
          'x-access-token': token
        }
      });
    }
    return req;
  }
}
