import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pre-loading',
  templateUrl: './pre-loading.component.html',
  styleUrls: ['./pre-loading.component.css']
})
export class PreLoadingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    localStorage.clear()
  }

}


