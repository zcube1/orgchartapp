import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  baseUrl:string = "https://yoururlhere.com/v1/";

  constructor(private http:HttpClient) {

  }

  post(endpoint:string, jsondata:any[]){
    console.log("post");
    //this.http.post(this.baseUrl + endpoint , jsondata).subscribe((res:any)=>{
      //code here
    //});
  }

  get(endpoint:string){
    console.log("get");
    //this.http.get(this.baseUrl + endpoint).subscribe((res:any)=>{
      //code here
    //})
  }
}
