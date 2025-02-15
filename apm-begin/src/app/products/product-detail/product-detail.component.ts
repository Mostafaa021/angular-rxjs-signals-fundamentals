import { Component, inject } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, CommonModule, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Subscription, tap } from 'rxjs';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [NgIf, NgFor, CurrencyPipe , CommonModule , AsyncPipe]
})
export class ProductDetailComponent {
  private productserivce  = inject(ProductService);
  errorMessage = '';
  product$ = this.productserivce.product$
  .pipe(
    catchError(err =>  {
      this.errorMessage = err
      return EMPTY;
}));

    //pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';
    pageTitle = this.product$  ;
  
  addToCart(product: Product) {
  }

}
