import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-employerrules',
  templateUrl: './rules.component.html'
})
export class EmployerRulesComponent implements OnInit {
  @Input() employerId: string;
  constructor() { }

  ngOnInit(): void {
  }

}
