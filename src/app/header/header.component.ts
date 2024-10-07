import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  status: any;
  constructor() { }
  ngOnInit() {
    this.status = localStorage.getItem('login')
    console.log("🚀 ~ HeaderComponent ~ ngOnInit ~ this.status:", this.status)
  }
  logout() {
    localStorage.clear();
    window.location.reload();
  }
}
