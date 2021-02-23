import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-employer-jobs',
  templateUrl: './jobs.component.html'
})
export class JobsComponent implements OnInit {
  @Input() employerProfileId: string;
  constructor() { }

  ngOnInit(): void {
  }

}
