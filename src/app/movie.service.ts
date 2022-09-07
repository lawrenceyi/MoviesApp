import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Movie } from 'src/models/Movie';
import { UserProfile } from 'src/models/UserProfile';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private url = 'api/movies/';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private http: HttpClient) { }

  getUserFavoriteMovies(username: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.url).pipe(
      tap((movies) => this.log(`retrieving movies`)),
      catchError(this.handleError<Movie[]>('getUserFavoriteMovies', []))
    )
  }

  uploadMovie(userprofile: UserProfile, movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(this.url, movie, this.httpOptions).pipe(
      tap((newMovie: Movie) => {
        this.log(`added movie with id ${ newMovie.id }`);
      }),
      catchError(this.handleError<Movie>('uploadMovie'))
    )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }
}
