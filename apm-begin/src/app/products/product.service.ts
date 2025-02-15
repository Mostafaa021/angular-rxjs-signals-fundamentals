import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, concatMap, empty, EmptyError, filter, map, mergeMap, Observable, of, pipe, retry, shareReplay, Subject, switchMap, tap, throwError } from 'rxjs';
import { Product } from './product';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Just enough here for the code to compile
  private productsUrl = 'api/products';
  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);

    // the same for behavior subject
    private productSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
    productSelected$ = this.productSelectedSubject.asObservable();

  
    readonly products$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      tap(products => console.log(JSON.stringify(products))),
      shareReplay(1) ,// Caches the latest emitted value
      catchError(err=> this.handleError(err)),
    );

  readonly product$ = this.productSelected$
  .pipe(
    filter(Boolean),
    switchMap(id => {
      const producturl = this.productsUrl+'/'+id;
      return this.http.get<Product>(producturl) 
      .pipe(
        mergeMap(product => this.getProductWithReviews(product)),       
      )
    }
    )
  )
   
        // mergeMap(flat Map)  in parallel 
       // or concatMap ( in sequential order)
       // or switchMap  cancel the previous request and start a new one
       //  expected to return an observable

  getselectedProduct(selectedProductId: number) : void {
    this.productSelectedSubject.next(selectedProductId); 
  }

  getProductWithReviews(product: Product) : Observable<Product> { // return an observable 
    if(product.hasReviews){
      const url = this.reviewService.getReviewUrl(product.id);
      return this.http.get<Review[]>(url)
      .pipe(
        map(reviews => ({...product, reviews} as Product)),
      );
    } else {
      return of(product);
    }
  }

  private handleError(error: HttpErrorResponse) : Observable<never> {
    const formattedMessage = this.errorService.formatError(error);
    return throwError(() =>formattedMessage);
  }
}
