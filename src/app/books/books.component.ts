import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  //forms
  myForm: any = FormGroup;
  editForm: any = FormGroup;

  //pagination
  page: number = 1;
  itemsPerPage: number = 5;

  //Book List
  obj: any = {};
  booksList: any;
  editData: any = {};

  //search
  query: string = '';


  constructor(private apiService: ServiceService, public bsModalRef: BsModalRef, public toastrService: ToastrService, private changeDetectorRef: ChangeDetectorRef, private formBuilder: FormBuilder) {
    this.myForm = new FormGroup({
      title: new FormControl('', Validators.required),
      author: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      publicationYear: new FormControl('', Validators.required),
      ISBN: new FormControl('', Validators.required)
    });
    this.editForm = this.formBuilder.group({
      title: [''],
      author: [''],
      description: [''],
      publicationYear: [''],
      ISBN: ['']
    });
  }

  ngOnInit(): void {
    this.getList()
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.apiService.postData('addBooks', this.myForm.value).subscribe(async (response: any) => {
        console.log('Data submitted successfully:', response);
        if (response.status) {
          this.toastrService.success(response.message, 'Success')
          this.myForm.reset();
          setTimeout(() => {
            window.location.reload()
          }, 1000);
        }
        else {
          this.toastrService.error(response.message, 'Error');
          this.myForm.reset();
        }
      });
    }
    else {
      this.toastrService.error("Please fill the required fields", 'Error');
    }
  }

  getList() {
    this.apiService.postData('booksList', {}).subscribe((list: any) => {
      this.booksList = list.data
      this.changeDetectorRef.detectChanges()
    })
  }

  getParticulars(id: any) {
    this.apiService.postData('particularList', { ISBN: id }).subscribe((getList: any) => {
      this.editData = getList?.data[0]
      this.editForm = this.formBuilder.group({
        title: [this.editData.title],
        author: [this.editData.author],
        description: [this.editData.description],
        publicationYear: [this.editData.publicationYear],
        ISBN: [this.editData.ISBN]
      });
    })
  }

  updates() {
    this.editData = { ...this.editData, ...this.editForm.value };
    this.editData.id = this.editData._id
    this.apiService.postData('updateBooks', this.editData).subscribe((updatedata: any) => {
      if (updatedata.status) {
        this.toastrService.success(updatedata.message, 'Success')
        setTimeout(() => {
          window.location.reload()
        }, 1000);
      }
      else {
        this.toastrService.error(updatedata.message, 'Error');
      }
    })
  }

  //search functionalities
  onSearch() {
    if (this.query.trim()) {
      this.apiService.params('searchBooks', this.query).subscribe((data: any) => {
        this.booksList = data.data;
      });
    }
    else if (this.query == '') {
      this.getList()
    }
  }


  delete(id: any) {
    this.apiService.postData('deleteBooks', { ISBN: id }).subscribe((deleted: any) => {
      if (deleted.status) {
        this.toastrService.success(deleted.message, 'Success')
        this.getList()
      }
      else {
        this.toastrService.error(deleted.message, 'Error');
      }
    })
  }

}