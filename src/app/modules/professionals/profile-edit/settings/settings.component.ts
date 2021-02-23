import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  @Input() professionalProfileId: string;
  constructor() { }

  ngOnInit(): void {
  }

}
