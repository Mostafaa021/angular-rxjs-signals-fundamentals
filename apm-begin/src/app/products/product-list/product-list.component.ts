import { Component, inject} from '@angular/core';

import { NgIf, NgFor, NgClass, CommonModule, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Subscription, tap } from 'rxjs';

@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent , AsyncPipe]
})
export class ProductListComponent {
  private productserivce  = inject(ProductService);
  // Just enough here for the template to compile
  pageTitle = 'Products';
  errorMessage = '';
  ProductSub$ ! : Subscription;
  readonly products$ = this.productserivce.products$
  .pipe(
    catchError(err=> {
      this.errorMessage = err;
      return EMPTY;
})
  );
  // Selected product id to highlight the entry
  readonly selectedProductId$ = this.productserivce.productSelected$;

  onSelected(productId: number): void {
    this.productserivce.getselectedProduct(productId);
  }
}
