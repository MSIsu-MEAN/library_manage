import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(public httpClient: HttpClient) { }

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'content-type': 'application/json'
  //   })
  // }

  // getData(url: any) {
  //   return this.httpClient.post(environment.commonUrl + url, this.httpOptions)
  // }
  // postData(url: any, data: any) {
  //   return this.httpClient.post(environment.commonUrl + url, data, this.httpOptions)
  // }

  // GET method
  getData(): Observable<any> {
    return this.httpClient.get(`${environment.commonUrl}`).pipe(
      tap(response => console.log('Data fetched:', response)),
      catchError(this.handleError('getData', []))
    );
  }

  // POST method
  postData(url:any,data: any): Observable<any> {
    return this.httpClient.post(`${environment.commonUrl}`+`${url}`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap(response => console.log('Data posted:', response)),
      catchError(this.handleError('postData', data))
    );
  }

  params(url:any,data: any): Observable<any> {
    return this.httpClient.get(`${environment.commonUrl}`+`${url}`+`?query=`+`${data}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
