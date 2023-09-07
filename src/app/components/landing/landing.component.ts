import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Location, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    
  })
};
export interface DATA{
  url:string;
  headers?:any[];
  forms?:any[];
  body?:string;
}
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
selectedMethod: string = 'GET';
apiUrl: string = ''; // Agregamos el campo para la URL
headers: { key: string, value: string }[] = [];
xforms: { key: string, value: string }[] = [];
jsonInput: string ="";
showData: boolean = false;
consultaData: any;
DATA:DATA={url:''};
public testBrowser  : boolean;
public data         : any;
  constructor(
    private location:Location, 
    private httpClient:HttpClient, 
    @Inject(PLATFORM_ID) platformId: string) { 
    this.testBrowser = isPlatformBrowser(platformId);
   }

  ngOnInit(): void {
   
   
  }
  addHeader() {
    this.headers.push({ key: '', value: '' });
  }
  deleteHeader(index: number) {
    this.headers.splice(index, 1);
  }
  addXForm() {
    this.xforms.push({ key: '', value: '' });
  }
  deleteXForm(index: number) {
    this.xforms.splice(index, 1);
  }
  showQuery() {
    // Lógica para mostrar u ocultar la consulta con los datos recibidos
    this.consultaData = {
      selectedMethod: this.selectedMethod,
      dataToAPI:{
        apiUrl: this.apiUrl,
        headers: this.headers,
        xforms: this.xforms,
        jsonInput: this.jsonInput
      }
    };
    this.showData = !this.showData;
  }
  
  getAPI(){
    return this.httpClient.post(`/get/loveAPI`,{}, httpOptions)
  }
  APIPOST(body:any){
    return this.httpClient.post(`/API/POST`,body, httpOptions)
  }
  APIGET(body:any){
    return this.httpClient.post(`/API/GET`,body, httpOptions)
  }

  setRequest(){
    this.DATA = {
        url: this.apiUrl
    };
    if(this.headers.length!=0){this.DATA.headers = this.headers}
    if(this.xforms.length!=0){ this.DATA.forms = this.xforms}
    if(this.jsonInput!=''){this.DATA.body = this.jsonInput}
    console.log(this.DATA)
  }
  sendRequest(): void {
    if (this.testBrowser) { 
      let body = JSON.stringify(this.DATA);
    if(this.selectedMethod=='GET'){
      this.APIGET(body).subscribe(resp=>{
        console.log(resp)
      })

    }else{
      this.APIPOST(body).subscribe(resp=>{
        console.log(resp)
      })
    }
    // Lógica para el botón de éxito
    console.log("Éxito");}
    
  }

}
