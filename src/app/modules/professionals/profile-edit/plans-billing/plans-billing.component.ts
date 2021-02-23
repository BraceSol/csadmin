import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-plans-billing',
  templateUrl: './plans-billing.component.html'
})
export class PlansBillingComponent implements OnInit {
  @Input() professionalProfileId: string;
  constructor() { }

  ngOnInit(): void {
  }

}
