import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-employer-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  @Input() employerProfileId: string;
  constructor() { }

  ngOnInit(): void {
  }

}
