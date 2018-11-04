import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'; 
import { AuthserviceProvider } from '../../providers/authservice/authservice';
/**
 * Generated class for the KehadiranPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kehadiran',
  templateUrl: 'kehadiran.html',
})
export class KehadiranPage {
  userData :any;

  
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
  Url7 : any;
  validateAttendance: any;
  id_pen: any;
  dayList = [
    {name : 'Isnin', value : 'ISNIN'},
    {name : 'Selasa', value : 'SELASA'} ,
    {name : 'Rabu', value : 'RABU'},
    {name : 'Khamis', value : 'KHAMIS'},
    {name : 'Jumaat', value : 'JUMAAT'}];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http, public authService: AuthserviceProvider, public forgotCtrl: AlertController ){
  

    this.Url = this.authService.serverAPI + 'api/sesi';
    this.Url2 = this.authService.serverAPI + 'api/jadualKelas';
    this.Url3= this.authService.serverAPI + 'api/jadualHari';
    this.Url4 = this.authService.serverAPI + 'api/jadualSlot';
    this.Url5= this.authService.serverAPI + 'api/jadualPelajar';
    this.Url6 = this.authService.serverAPI +  'api/getJadualID'; 
    this.Url7 = this.authService.serverAPI +  'api/kehadiran'; 
    
     
    this.http.get(this.Url)
    .map(res => res.json())
    .subscribe(data => {
      this.sessions = data;
      console.log(data);
    });

    this.userData = JSON.parse(window.localStorage.getItem('userData'));
    this.bahagian = this.userData.bahagian;
    this.id_pen = this.userData.id_pengajar;
    console.log('username ',this.userData.id_pengajar);
    
  }

  setDay(data) {
    this.http.get(this.Url4+'?bahagian='+this.bahagian+"&id_pen="+this.id_pen+"&hari="+data)
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
    this.validateKehadiran();
  }

  validateKehadiran() {
   const { idj } = this.schedules[0];

    this.http.get(this.Url7+'?idj='+idj+'&date='+this.selectedDate)
    .map(res => res.json())
    .subscribe(data => {
      this.validateAttendance = data;

      if(this.validateAttendance.length > 0) {
        
        this.students.forEach( (element, index) => {
          let filtered = this.validateAttendance.filter(x => {
            return x.id_pelajar == element.id_pelajar;
          });
          // console.log('filered ', filtered[0].kehadiran);

            this.students[index] = {...this.students[index], kehadiran :  filtered[0].kehadiran};
          });
          
      }
      
      console.log('validate ',this.validateAttendance);
    });
  }

  getPelajar() {
    //bahagian kelas sesi
    const { bahagian, kelas, sesi } = this.schedules[0];

    console.log(bahagian, kelas, sesi);
    this.http.get(this.Url5+'?sesi='+sesi+'&kelas='+kelas+'&bahagian='+bahagian)
    .map(res => res.json())
    .subscribe(data => {
      this.students = data;

      // this.students.forEach( (element, index) => {
      //       this.students[index] = {...this.students[index], kehadiran : '/'};
      //     });
          
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

  // setSession(data) {
  //   this.http.get(this.Url2+'/?id='+data+"&idp="+this.userData.id_pengajar)
  //   .map(res => res.json())
  //   .subscribe(data => {
  //     this.classes = data;
  //     console.log(data);
  //   });
  //   this.session = data;
  // }

  onCancelSession(event) {
    this.sessions = [];
  }

  // setClass(data) {
  //   this.http.get(this.Url3+'/?sesi='+this.session+"&kelas="+data)
  //   .map(res => res.json())
  //   .subscribe(data => {
  //     this.days = data;
  //     console.log(data);
  //   });
  //   this.selectedClass = data;
  //   this.getPelajar();
  // }

  // setDay(data) {
  //   this.http.get(this.Url4+'/?sesi='+this.session+"&kelas="+this.selectedClass+"&hari="+data)
  //   .map(res => res.json())
  //   .subscribe(data => {
  //     this.slots = data;
  //     console.log(data);
  //   });
  //   this.selectedDay = data;
  // }




  selectMember(data){
    if (data.checked == true) {
      //  this.selectedArray.push({id:data.id_pelajar, checked:true});
      let studIndex = this.students.findIndex(obj => obj.id_pelajar === data.id_pelajar);
      this.students[studIndex] = {...this.students[studIndex]};
      console.log('updated student ',this.students);
     } else {
       data.checked=false;
      let studIndex = this.students.findIndex(obj => obj.id_pelajar === data.id_pelajar);
      this.students[studIndex] = {...this.students[studIndex]};
      console.log('updated student ',this.students);
    }
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
    console.log('ionViewDidLoad KehadiranPage');
  }

}
