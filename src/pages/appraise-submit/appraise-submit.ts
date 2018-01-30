import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController} from 'ionic-angular';
// import { PhotoLibrary } from '@ionic-native/photo-library';
import {Camera, CameraOptions} from "@ionic-native/camera";
// import {appApis} from "../../providers/apis";
import {HttpServiceProvider} from "../../providers/http-service/http-service";

@Component({
  selector: 'page-appraise-submit',
  templateUrl: 'appraise-submit.html',
})
export class AppraiseSubmitPage {
  avatar: string = "";
  photoList: any = [];
  public url: string = 'placeholder.jpg';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpServiceProvider,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    // private photoLibrary: PhotoLibrary,
    public camera: Camera
  ) {

   }

  ionViewDidLoad() {
  }
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [{
        text: '拍照',
        role: 'takePhoto',
        handler: () => {
          this.takePhoto();
        }
      }, {
        text: '从相册选择',
        role: 'chooseFromAlbum',
        handler: () => {
          this.chooseFromAlbum();
        }
      }, {
        text: '取消',
        role: 'cancel',
        handler: () => {
          console.log("cancel");
        }
      }]
    });

    actionSheet.present().then(value => {
      return value;
    });
  }
  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      allowEdit: true,
      targetWidth: 200,
      targetHeight: 200,
      saveToPhotoAlbum: true,
    };

    this.camera.getPicture(options).then(image => {
      console.log('Image URI: ' + image);
      this.avatar = image.slice(7);
    }, error => {
      console.log('Error: ' + error);
    });
  }

  chooseFromAlbum() {
    /*this.photoLibrary.requestAuthorization().then(() => {
      // this.photoLibrary.getAlbums();
      // this.photoLibrary.getPhoto;
      this.photoLibrary.getLibrary().subscribe({
        next: library => {
          this.photoList = library;

          library.forEach(function(libraryItem) {

            // console.log(libraryItem.id);          // ID of the photo
            console.log(libraryItem.photoURL);    // Cross-platform access to photo
            console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
            // console.log(libraryItem.fileName);
            // console.log(libraryItem.width);
            // console.log(libraryItem.height);
            // console.log(libraryItem.creationDate);
            // console.log(libraryItem.latitude);
            // console.log(libraryItem.longitude);
            // console.log(libraryItem.albumIds);
          });

        },
        error: err => { console.log('could not get photos'); },
        complete: () => { console.log('done getting photos'); }
      });
    })
    .catch(err => console.log('permissions weren\'t granted'));*/
  }

  presentAlert() {
    let alert = this.alertCtrl.create({title: "上传失败", message: "只能选择一张图片作为头像哦", buttons: ["确定"]});
    alert.present().then(value => {
      return value;
    });
  }
  toBack() {
    this.navCtrl.pop();
  }
}
