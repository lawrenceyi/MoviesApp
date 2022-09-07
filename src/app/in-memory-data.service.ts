import { Injectable } from '@angular/core';
import { Movie } from 'src/models/Movie';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService {
  createDb() {
    const movies: Movie[] = [
      {
        "title": "Jaws",
        "dateWatched": 10221999,
        "id": 1
      },
      {
        "title": "Sound of Music",
        "dateWatched": 10072010,
        "id": 2
      }
    ];
    return { movies };
  }

  // generate an id, one greater than the biggest id
  // if there are no movies, default to an id of 1
  genId(movies: Movie[]): number {
    return movies.length > 0 ? Math.max(...movies.map(movie => movie.id)) + 1 : 1;
  }

  constructor() { }
}
