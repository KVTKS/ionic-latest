import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthserviceProvider } from '../../providers/authservice/authservice';
/**
 * Generated class for the PelajarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pelajar',
  templateUrl: 'pelajar.html',
})
export class PelajarPage {
  userData :any;
  Url : any;
  Url1 : any;
  students:any;
  groupedStudents: any;
  id_pen: any;
  subjects: any;

  constructor(public navCtrl: NavController, public http:Http,  public authService: AuthserviceProvider) {
    
    this.userData = JSON.parse(window.localStorage.getItem('userData'));
    this.id_pen = this.userData.id_pengajar;

    this.Url = this.authService.serverAPI + 'api/kehadiran/pelajarBySubjek?id='+this.id_pen;
    this.Url1 = this.authService.serverAPI + 'api/subjek/pengajar?id='+this.id_pen
    this.http.get(this.Url)
    .map(res => res.json())
    .subscribe(data => {
      this.students = data;
      this.groupedStudents= this.groupBy(this.students, 'nama_pelajar');
      console.log('grouped ',this.groupedStudents);
      this.countKehadiran(this.groupedStudents);
    });
    this.getSubjects();
  }
  groupBy(arr, key) {
      var newArr = [],
          Keys = {},
          newItem, i, j, cur;
      for (i = 0, j = arr.length; i < j; i++) {
          cur = arr[i];
          if (!(cur[key] in Keys)) {
              Keys[cur[key]] = { nama: cur[key], data: [], id_p :cur['id_p'] };
              newArr.push(Keys[cur[key]]);
          }
          Keys[cur[key]].data.push(cur);
      }
      return newArr;
  }

  countKehadiran(arr) {
 
     arr.forEach( (element, index) => {
        let total = element.data.length;
        let hadirCount = 0;
        element.data.forEach ((child , i) => {
          // console.log('kehadiran', child.kehadiran);
          switch(child.kehadiran) { 
            case "/": { 
              hadirCount += 1; 
               break; 
            } 
            case "o": { 
               break; 
            } 
            default: { 
              hadirCount += 1; 
               break; 
            } 
         } 
         let perc = hadirCount/total * 100;
         let percentage = perc.toFixed(2)
         arr[index] = {...arr[index], percentage };
        })
    });
  }

  getSubjects() {
    this.http.get(this.Url1)
    .map(res => res.json())
    .subscribe(data => {
      this.subjects = data;
      console.log('subjek', this.subjects);
    });
  }
  setSubject(data) {
    let filtered = this.students.filter(x => {
      return x.id_sub == data;
    });
    
    this.groupedStudents= this.groupBy(filtered, 'nama_pelajar');
    this.countKehadiran(this.groupedStudents);
  }
  ionViewDidLoad() {

    console.log('ionViewDidLoad PelajarPage');
  }

}

