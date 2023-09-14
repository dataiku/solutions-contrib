import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { isDevMode } from '@angular/core';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private apiUrl: string;

  constructor() {
    this.apiUrl = this.getApiUrl();
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const modifiedRequest = request.clone({
      url: `${this.apiUrl}${request.url}`
    })
    return next.handle(modifiedRequest);
  }

  private getApiUrl(): string {

    if (!isDevMode()) {

      // @ts-ignore 
      const getWebappBackendUrlFn = window['getWebAppBackendUrl'] || parent["getWebAppBackendUrl"];
      if (typeof getWebappBackendUrlFn === 'function') {
        return getWebappBackendUrlFn('');
      }
    }
    return process.env["API_DEV_URL"] || '/';
  }
}
