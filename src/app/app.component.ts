import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Movie } from 'src/models/Movie';
import { UserProfile } from 'src/models/UserProfile';
import { MovieService } from './movie.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  userName: string | undefined;
  isMoviesLoaded = false;
  isLoading = true;

  usersSub$: Subscription | undefined;
  moviesSub$: Subscription | undefined;

  movies: Movie[] = [];

  public form = this.fb.group({
    title: ['', [Validators.required]],
    dateWatched: ['', [Validators.min(0), Validators.required]]
  })

  get title() {
    return this.form.get('title') as FormControl;
  }

  get dateWatched() {
    return this.form.get('dateWatched') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private movieService: MovieService
  ) { }

  ngOnInit(): void {
    this.getLoggedInUser();
  }

  getLoggedInUser() {
    this.usersSub$ = this.userService.getUser()
      .subscribe({
        next: (data) => {
          this.userName = data.username;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
        }
      })
  }

  getMovies() {
    if (this.userName === undefined) {
      console.error('Login failure');
      return;
    }
    this.isLoading = true;
    this.moviesSub$ = this.movieService.getUserFavoriteMovies(this.userName)
      .subscribe({
        next: (data) => {
          this.movies = data;
          this.isMoviesLoaded = true;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      })
  }

  submit() {
    if (this.userName === undefined) {
      console.error('Login failure');
      return;
    }
    this.isLoading = true;
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.isLoading = false;
    } else {
      const userProfile = {
        username: this.userName
      } as UserProfile;

      const dateWatchedFormValue = this.form.get('dateWatched')?.value;
      let date = -1;
      if(!isNaN(Number(dateWatchedFormValue))){
        date = Number(dateWatchedFormValue);
      }

      const movie = {
        title: this.form.get('title')?.value,
        dateWatched: date
      } as Movie;

      this.movieService.uploadMovie(userProfile, movie)
        .subscribe({
          next: (data) => {
            this.movies.push(data);
            this.isLoading = false;
          },
          error: (err) => {
            console.error(`Error retrieving movies: ${err}`);
            this.isLoading = false;
          }
        })
    }
  }

  ngOnDestroy(): void {
    this.usersSub$?.unsubscribe();
    this.moviesSub$?.unsubscribe();
  }
}
