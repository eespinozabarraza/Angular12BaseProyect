import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
private API_ROUTE:string = '';
  constructor(private location:Location, private httpClient:HttpClient) { 
    let _relative_path = this.location.path();
    this.location.subscribe(data=>{
      if(data){
        let path = _relative_path;
        let relative = data.url?.toString()||'';
        this.API_ROUTE = path.replace(relative, "");
      }
    })
   }

  ngOnInit(): void {
    this.getAPI().subscribe(resp=>{
      console.log(resp)
    })
  }
  getAPI(){
    return this.httpClient.post(`${this.API_ROUTE}/hola`,{})
  }

}
