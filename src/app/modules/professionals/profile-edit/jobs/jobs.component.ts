import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html'
})
export class JobsComponent implements OnInit {
  @Input() professionalProfileId: string;
  constructor() { }

  ngOnInit(): void {
  }

}
