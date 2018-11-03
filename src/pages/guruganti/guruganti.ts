import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'; 
import { AuthserviceProvider } from '../../providers/authservice/authservice';

@IonicPage()
@Component({
  selector: 'page-guruganti',
  templateUrl: 'guruganti.html',
})
export class GurugantiPage {

userData :any;
pengajar: any;
bahagian:any;
sessions:any;
classes:any;
attendanceOptions = [ 
  {name : 'Hadir', value : '/'},
  {name : 'Tidak Hadir', value : 'o'} ,
  {name : 'Kebenaran', value : 'k'}
];

days:any;
slots:any;
students:any;
selectedClass:any;
selectedDay:any;
schedules:any;
selectedDate :any;
idJadual: any;
Url: any;
Url2: any;
Url3: any;
Url4: any;
Url5: any;
Url6: any;
Url7: any;
id_pen: any;
dayList = [
  {name : 'Isnin', value : 'ISNIN'},
  {name : 'Selasa', value : 'SELASA'} ,
  {name : 'Rabu', value : 'RABU'},
  {name : 'Khamis', value : 'KHAMIS'},
  {name : 'Jumaat', value : 'JUMAAT'}];


constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http, public authService: AuthserviceProvider, public forgotCtrl: AlertController ){

this.Url7 = this.authService.serverAPI + 'api/pengajar';

this.http.get(this.Url7)
    .map(res => res.json())
    .subscribe(data => {
      this.pengajar = data;
      console.log(data);
    });

    this.userData = JSON.parse(window.localStorage.getItem('userData'));
    this.bahagian = this.userData.bahagian;
    this.id_pen = this.userData.id_pengajar;
    this.Url = this.authService.serverAPI + 'api/sesi';
    this.Url2 = this.authService.serverAPI + 'api/jadualKelas';
    this.Url3= this.authService.serverAPI + 'api/jadualHari';
    this.Url4 = this.authService.serverAPI + 'api/jadualSlot';
    this.Url5= this.authService.serverAPI + 'api/jadualPelajar';
    this.Url6 = this.authService.serverAPI +  'api/getJadualID'; 
}

setpengajar(data) {
  this.id_pen = data;
  let temp = this.pengajar.filter(x => {
    return x.id_pengajar == data;
  });
  const { bahagian  } = temp[0];
  this.bahagian = bahagian;
  // console.log(this.bahagian, this.id_pen);
}
  
setDay(data) {
  console.log(this.id_pen);
  const { bahagian } = this;
  this.http.get(this.Url4+'?bahagian='+bahagian+"&id_pen="+this.id_pen+"&hari="+data)
    .map(res => res.json())
    .subscribe(data => {
      this.slots = data;
      console.log('after day selected: ',data);
    });
    // console.log(data);
}

setSlot(data) {
  // this.http.get(this.Url6+'/?sesi='+this.session+"&kelas="+this.selectedClass+"&hari="+this.selectedDay+"&slot="+data)
  // .map(res => res.json())
  // .subscribe(data => {
  //   this.idJadual = data[0].idj;
  //   console.log('id jadual ',data[0].idj);
  // });
  
  this.schedules = this.slots.filter(x => {
    return x.slot == data;
  });
  console.log('this schedule filtered ',  this.schedules);
 
}

setDate(data) {
  this.selectedDate = data;
  console.log('date ', this.selectedDate);
  this.getPelajar();
}

getPelajar() {
  //bahagian kelas sesi
  const { bahagian, kelas, sesi } = this.schedules[0];

  console.log(bahagian, kelas, sesi);
  this.http.get(this.Url5+'?sesi='+sesi+'&kelas='+kelas+'&bahagian='+bahagian)
  .map(res => res.json())
  .subscribe(data => {
    this.students = data;

    this.students.forEach( (element, index) => {
          this.students[index] = {...this.students[index], kehadiran : '/'};
        });
        
    console.log('student ',this.students);
  });
}

setAttendance(data, id_pelajar) {
  console.log('datapelajar passed ', data);
  // let filteredStudent = this.students.filter(student => {
  //   return student.id_pelajar == id_pelajar;
  // });
  let studIndex = this.students.findIndex(obj => obj.id_pelajar == id_pelajar);
  this.students[studIndex] = {...this.students[studIndex], kehadiran: data};

  console.log('students, ' ,this.students);
}

submitAttendance() {

  console.log('submit data ', this.schedules);
  const { idj } = this.schedules[0];
  this.students.forEach( (element, index) => {
    this.students[index] = {...this.students[index], date: this.selectedDate, idj};
  });
  
  this.authService.saveKehadiran(this.students).then(
    result => {
      console.log('attendance result', result);

      let alert = this.forgotCtrl.create({
        title: "Success!",
        subTitle: "Kehadiran disimpan",
        buttons: ["OK"]
      });
      alert.present();
    }
  ).catch(err => console.log(err));
 }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GurugantiPage');
  }

}
