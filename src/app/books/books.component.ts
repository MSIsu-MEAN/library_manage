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
  booksList: any;
  editData: any = {};

  //search
  query: string = '';

  //signIn
  obj: any = {};
  tocheck: boolean = false;
  status: any;


  constructor(private apiService: ServiceService, public bsModalRef: BsModalRef, public toastrService: ToastrService, private changeDetectorRef: ChangeDetectorRef, private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      description: ['', [Validators.required]],
      publicationYear: ['', [Validators.required, Validators.min(1000), Validators.max(2024)]],
      ISBN: ['', [Validators.required]],
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
    this.status = localStorage.getItem('login')
  }

  submit(form: any) {
    this.tocheck = true
    if (form.valid) {
      console.log("obj", this.obj);
      this.apiService.postData('signIn', this.obj).subscribe((res) => {
        if (res.status) {
          localStorage.setItem('login', 'true')
          this.toastrService.success(res.message, 'Success')
          form.reset();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          this.tocheck = false
        }
      })
    }
    else {
      form.reset()
      this.toastrService.error("Please enter the required fields", 'Error')
    }
  }



  //adding book function
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
        }
      });
    }
    else {
      this.toastrService.error("Please fill the required fields", 'Error');
    }
  }

  //get all list
  getList() {
    this.apiService.postData('booksList', {}).subscribe((list: any) => {
      this.booksList = list.data
      this.changeDetectorRef.detectChanges()
    })
  }

  //getting particular datas
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

  //update function
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

  //delete function
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
