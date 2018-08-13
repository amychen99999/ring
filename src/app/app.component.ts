import { Component, OnDestroy, ViewChild } from '@angular/core'
import { Platform, Nav, ItemSliding} from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
// import { Geolocation } from '@ionic-native/geolocation';

import { TabsController } from '../pages/tabs/tabs'
import { PostController } from '../pages/home/post'

import { AngularFireAuth } from 'angularfire2/auth'
import { FCM } from '@ionic-native/fcm'

import { FirestoreService } from '../services/firestoreService'
import { Subscription } from 'rxjs'
import { PostType } from '../angularModel';
import { HomePage } from '../pages/home/home';

@Component({
    templateUrl: 'app.html'
})
export class MyApp implements OnDestroy {
    @ViewChild('content') nav: Nav;
    // lat: any;
    // lng: any;
    postSubscription: Subscription
    rootPage: any = TabsController
    postTypes: PostType[]
    adminSubscription: Subscription
    // slides = [
    //     {
    //       title: "Welcome to the Docs!",
    //       description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
    //       image: "assets/imgs/icon.png",
    //     },
    //     {
    //       title: "What is Ionic?",
    //       description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
    //       image: "assets/imgs/icon.png",
    //     },
    //     {
    //       title: "What is Ionic Cloud?",
    //       description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
    //       image: "assets/imgs/icon.png",
    //     }
    //   ];

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, firestoreService: FirestoreService, angularfireAuth: AngularFireAuth, fcm: FCM) {
        this.postSubscription = firestoreService.getPostTypes().subscribe(postTypes => this.postTypes = postTypes)
        platform.ready().then(() => {
            statusBar.styleDefault()
            splashScreen.hide()

            angularfireAuth.authState.subscribe(firebaseUser => {
                if (firebaseUser) {
                    fcm.subscribeToTopic("postTopic")
                    firestoreService.getAdminByAccount(firebaseUser.uid).subscribe(admin => {
                        fcm.getToken().then(token => {
                            admin.member.fcmToken = token
                            // admin.member.position.lat = this.lat
                            // admin.member.position.lng = this.lng
                            firestoreService.setFcmToken(admin)
                        })

                        fcm.onTokenRefresh().subscribe(token => {
                            admin.member.fcmToken = token
                            // admin.member.position.lat = this.lat
                            // admin.member.position.lng = this.lng
                            firestoreService.setFcmToken(admin)
                        })
                    })
                } else
                    this.ngOnDestroy()
            })

        })
    }
    
    ionViewDidLoad() {
        console.log("start app")
    }

    ngOnDestroy() {
        if (this.adminSubscription)
            this.adminSubscription.unsubscribe()
    }

    goToPage(name) {
        this.nav.push(PostController, name)
    }

    // goToHomePage() {
    //     this.nav.push(HomePage)
    // }

    // doSomething(slidingItem: ItemSliding) {
    //     slidingItem.close()
    // }
}
