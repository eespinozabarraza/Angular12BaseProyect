import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Location, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
private API_ROUTE:string = '';

public testBrowser  : boolean;
public data         : any;
  constructor(
    private location:Location, 
    private httpClient:HttpClient, 
    @Inject(PLATFORM_ID) platformId: string) { 
    let _relative_path = this.location.path();
    this.testBrowser = isPlatformBrowser(platformId);
    this.location.subscribe(data=>{
      if(data){
        let path = _relative_path;
        let relative = data.url?.toString()||'';
        this.API_ROUTE = path.replace(relative, "");
      }
    })
   }

  ngOnInit(): void {
    if (this.testBrowser) { 
      this.getAPI().subscribe(resp=>{
      console.log(resp)
    })}
   
  }
  getAPI(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        
      })
    };
    return this.httpClient.post(`/get/loveAPI`,{}, httpOptions)
  }

}
