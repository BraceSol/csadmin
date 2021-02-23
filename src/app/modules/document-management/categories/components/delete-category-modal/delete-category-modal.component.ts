import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { CategoryService } from '../../../_services';

@Component({
  selector: 'app-delete-category-modal',
  templateUrl: './delete-category-modal.component.html',
  styleUrls: ['./delete-category-modal.component.scss']
})
export class DeleteCategoryModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  isLoading = false;
  subscriptions: Subscription[] = [];
  userId;
  constructor(
    private categoryService: CategoryService,
    public modal: NgbActiveModal,
    ) { 
      this.userId = localStorage.getItem('userId');

    }

  ngOnInit(): void {
  }

  deleteCategory() {
    this.isLoading = true;
 
      const deletedocCategory = `deleteDocumentCategory?adminId=${this.userId}&documentCategoryId=${this.id}`;
      this.categoryService.fetchData(deletedocCategory).subscribe((res: any)=> {
        console.log(res.message);
        this.isLoading = false;
        if(!res.hasError){
          this.modal.close()
        } else {
        }
      }, error => {
        console.log('server error')
      })
    // const sb = this.categoryService.delete(this.id).pipe(
    //   delay(1000), // Remove it from your code (just for showing loading)
    //   tap(() => this.modal.close()),
    //   catchError((err) => {
    //     this.modal.dismiss(err);
    //     return of(undefined);
    //   }),
    //   finalize(() => {
    //     this.isLoading = false;
    //   })
    // ).subscribe();
    // this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
