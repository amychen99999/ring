import { NgModule, ErrorHandler } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'
import { HttpModule } from '@angular/http'
import { IonicStorageModule } from '@ionic/storage'
import { MyApp } from './app.component'
import { Geolocation } from '@ionic-native/geolocation';

import { SQLite } from '@ionic-native/sqlite'
import { FCM } from '@ionic-native/fcm'

import { AngularFireModule } from 'angularfire2'
import { AngularFirestoreModule } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'

import { TabsController } from '../pages/tabs/tabs'
import { AroundListController } from '../pages/around/aroundList'
import { AroundDetailController } from '../pages/around/aroundDetail'
import { FriendListController } from '../pages/friends/friendList'
import { FriendDetailController } from '../pages/friends/friendDetail'
import { ContactListController } from '../pages/message/contactList'
import { ContacthatModule } from '../pages/message/contactChat.module'
import { SettingController } from '../pages/setting/setting'

import { FirestoreService } from '../services/firestoreService'
import { MessageService } from '../services/messageService'

import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'

import * as environment from './environment'
import { HomePage } from '../pages/home/home';
import { PostController } from '../pages/home/post'
import { RegisterController } from '../pages/setting/register';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        PostController,
        TabsController,
        AroundListController,
        AroundDetailController,
        FriendListController,
        FriendDetailController,
        ContactListController,
        SettingController,
        RegisterController,
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({
            name: '__mydb',
            driverOrder: ['indexeddb', 'sqlite', 'websql']
        }),
        HttpModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        ContacthatModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        PostController,
        TabsController,
        AroundListController,
        AroundDetailController,
        FriendListController,
        FriendDetailController,
        ContactListController,
        SettingController,
        RegisterController
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        AngularFireAuth,
        SQLite,
        FCM,
        FirestoreService,
        MessageService,
        Geolocation
    ]
})
export class AppModule { }
