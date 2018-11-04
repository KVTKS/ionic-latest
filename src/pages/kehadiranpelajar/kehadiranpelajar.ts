import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthserviceProvider } from '../../providers/authservice/authservice';
import * as moment from 'moment';
/**
 * Generated class for the KehadiranpelajarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kehadiranpelajar',
  templateUrl: 'kehadiranpelajar.html',
})
export class KehadiranpelajarPage {
  userData:any;
  id_pelajar:any;
  Url: any;
  attendances : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http, public authService: AuthserviceProvider, public forgotCtrl: AlertController) {
    this.userData = JSON.parse(window.localStorage.getItem('userPelajar'));
    console.log(this.userData);
    this.id_pelajar=Number(this.userData.id_pelajar);
    this.getAttendance(this.id_pelajar).then(res => {
      this.changeAttendanceValue();
    });
  }

  getAttendance(id) {
    return new Promise((resolve,reject)=>{
      this.Url = this.authService.serverAPI + 'api/kehadiran/pelajar?id='+id;

      this.http.get(this.Url)
      .map(res => res.json())
      .subscribe(data => {
        resolve(data);
        this.attendances = data;
      },err=>{
        reject(err);
      });
    })
  }

  changeAttendanceValue () {
    this.attendances.forEach( (element, index) => {
      let tarikh = moment(element.tarikh).format("DD/MM/YYYY");
      switch(element.kehadiran) { 
        case "/": { 
          this.attendances[index] = {...this.attendances[index], kehadiran : 'Hadir', tarikh};
           break; 
        } 
        case "o": { 
          this.attendances[index] = {...this.attendances[index], kehadiran : 'Tidak Hadir', tarikh};
           break; 
        } 
        default: { 
          this.attendances[index] = {...this.attendances[index], kehadiran : 'Kebenaran', tarikh};
           break; 
        } 
     } 
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KehadiranpelajarPage');
  }

}
