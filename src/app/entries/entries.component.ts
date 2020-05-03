import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css'],
  host: { class: 'flex-full-height' },
})
export class EntriesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
