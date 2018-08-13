import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import { PostController } from '../home/post'

import { FirestoreService } from '../../services/firestoreService'
import { PostType, ChatMessage, Admin } from '../../angularModel'
import { Subscription } from 'rxjs'
import { MessageService } from '../../services/messageService';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { not } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnDestroy {
  postPage: any = PostController

  logged: Boolean = false
  postTypeSubscription: Subscription
  adminTypeSubscription: Subscription
  postTypes: PostType[]
  visitorAdmin: Admin

  constructor(private firestoreService: FirestoreService, private angularfireAuth: AngularFireAuth, private messageService: MessageService) {
    angularfireAuth.authState.subscribe(firebaseUser => {
      this.logged = !!firebaseUser
      if (this.logged) {
        this.postTypeSubscription = firestoreService.getPostTypes().subscribe(postTypes => this.postTypes = postTypes)
        getVisitor()
      }
      else
        this.ngOnDestroy()
    })
    console.log("con")
  }

  ngOnDestroy() {
    if (this.postTypeSubscription)
      this.postTypeSubscription.unsubscribe()
    this.postTypes = []
  }
}

export function getVisitor(): Admin {
  var account
  var newAdmin: Admin = null
  var id
  this.firestoreService.getAdmins().subscribe(admins => {
    id = (admins.length + 2).toString
  })
  const admin: Admin = {
    id: id,
    account: account,
    member: {
         id: id,
        account: account,
        name: "訪客" + id,
        phone: '',
        email: '',
        fcmToken: account,
        position: {lat: 0, lng: 0}
    },
    role: "visitor"
    }
    return admin
}
