import { Injectable } from '@angular/core'
import { Headers, Http, Response } from '@angular/http'
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/toPromise'

import { Admin, PostType, Member } from '../angularModel'

@Injectable()
export class FirestoreService {
    private url = "https://us-central1-aroundme-e234d.cloudfunctions.net"
    private adminCollection: AngularFirestoreCollection<Admin>
    private postCollection: AngularFirestoreCollection<PostType>

    constructor(private database: AngularFirestore, private http: Http) {
        this.adminCollection = database.collection<Admin>("Admin")
        this.postCollection = database.collection<PostType>("PostType", ref => ref.orderBy("id", "asc"))
    }

    setFcmToken(admin: Admin): Promise<void> {
        return this.adminCollection.doc<Admin>(admin.account).update({
            member: admin.member
        })
    }

    getAdmins(): Observable<Admin[]> {
        return this.adminCollection.valueChanges()
    }

    getAdminByAccount(account: string): Observable<Admin> {
        return this.adminCollection.doc<Admin>(account).valueChanges()
    }

    async addFriend(member: Member, friendMember: Member): Promise<any> {
        var friend = {
            member,
            friendMember
        }
        return this.http.post(this.url + "/addFriend", friend).toPromise()
    }

    deleteFriend(account: string, friendAccount: string): Promise<void> {
        this.adminCollection.doc(friendAccount).collection<Member>("friends").doc(account).delete()
        return this.adminCollection.doc(account).collection<Member>("friends").doc(friendAccount).delete()
    }

    getFriends(account: string): Observable<Member[]> {
        return this.adminCollection.doc<Admin>(account).collection<any>("friends").valueChanges()
    }

    getFriend(account: string, friendAccount: string): Observable<Member> {
        return this.adminCollection.doc<Admin>(account).collection<any>("friends").doc<Member>(friendAccount).valueChanges()
    }

    getPostTypes(): Observable<PostType[]> {
        return this.postCollection.valueChanges()
    }

    getPostTypeByPostName(postName: string): Observable<PostType> {
        return this.postCollection.doc<PostType>(postName).valueChanges()
    }

    async registerAdmin(admin: Admin): Promise<any> {
        return this.http.post(this.url + "/addAdmin", admin).toPromise()
    }
}