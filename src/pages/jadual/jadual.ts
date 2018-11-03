import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthserviceProvider } from '../../providers/authservice/authservice';


@IonicPage()
@Component({
  selector: 'page-jadual',
  templateUrl: 'jadual.html',
})
export class JadualPage {
  userData:any;
  id_pen:any;

  Url: any;
  jadual:any;
  sessions:any;

  idSub:any=[];

  class_data:any=[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http, public authService: AuthserviceProvider, public forgotCtrl: AlertController ){
    this.userData = JSON.parse(window.localStorage.getItem('userData'));
    this.id_pen=Number(this.userData.id_pengajar);
    this.getSchedule(this.id_pen).then(res => {
      console.log('this classdata ', this.class_data);
    });
    // this.getClassData().then(res_data=>{
    //   this.class_data=res_data;
    //   this.getIDSUB().then((res_idsub:any=[])=>{
    //     for(var i=0;i<this.class_data.length;i++)
    //     {
    //       for(var inner=0;inner<res_idsub.length;inner++)
    //       {
    //         if(Number(res_idsub[inner].idsub)==Number(this.class_data[i].id_sub))
    //         {
    //           this.class_data[i].subject_name=res_idsub[inner].subjek;
    //         }
    //       }
    //     }
    //   },err=>{
    //     console.log("ERROR GETTING ID SUB");
    //   })
    // },err=>{
    //   console.log("ERROR FETCHING DATA");
    // })

  }

  getSchedule(id_pengajar) {
    return new Promise((resolve,reject)=>{
      this.Url = this.authService.serverAPI + 'api/jadual?id='+id_pengajar;

      this.http.get(this.Url)
      .map(res => res.json())
      .subscribe(data => {
        resolve(data);
        this.class_data = data;
      },err=>{
        reject(err);
      });
    })
  }

  getClassData()
  {
    return new Promise((resolve,reject)=>{
      this.Url = this.authService.serverAPI + 'api/jadual';

      this.http.get(this.Url)
      .map(res => res.json())
      .subscribe(data => {
        resolve(data);

      },err=>{
        reject(err);
      });
    })

  }

  getIDSUB()
  {
    return new Promise((resolve,reject)=>{
      let the_url= this.authService.serverAPI + 'api/jadual';
      this.http.get(the_url)
      .map(res => res.json())
      .subscribe(data => {
        resolve(data);
      },err=>{
        reject(err);
      });
    })

  }

  setsesi(data) {
    this.http.get(this.Url+'/?id_pen='+data+"&idj="+this.userData.sesi)
    .map(res => res.json())
    .subscribe(data => {
      this.jadual = data;
      console.log(data);
    });
    this.jadual = data;

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad jadualPage');
  }

}
