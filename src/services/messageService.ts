import { Injectable } from '@angular/core'
import { Headers, Http, Response } from '@angular/http'
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'
import * as uuid from 'uuid'

import { SQLite, SQLiteObject } from '@ionic-native/sqlite'

import { Observable } from 'rxjs'
import 'rxjs/add/operator/toPromise'

import { Admin, ChatMessage, PostType, Member, ChatMember } from '../angularModel'

@Injectable()
export class MessageService {
    private url = "https://us-central1-aroundme-e234d.cloudfunctions.net"
    private adminCollection: AngularFirestoreCollection<Admin>

    constructor(private database: AngularFirestore, private http: Http, private sqlite: SQLite) {
        this.adminCollection = database.collection<Admin>("Admin")
        this.getSQLiteDB()
    }

    getLatestPost(postType: string): Observable<ChatMessage> {
        const postTypeCollection = this.database.collection<PostType>("PostType").doc(postType).collection<ChatMessage>("messages", ref => ref.orderBy("timestamp", "desc").limit(1))
        return postTypeCollection.valueChanges().map(messages => messages[0])
    }

    getPosts(postType: string): Observable<ChatMessage[]> {
        const postTypeCollection = this.database.collection<PostType>("PostType").doc(postType).collection<ChatMessage>("messages", ref => ref.orderBy("timestamp", "desc"))
        return postTypeCollection.valueChanges()
    }

    getChatMessageByAccount(account: string): Observable<ChatMessage[]> {
        return this.adminCollection.doc(account).collection<ChatMessage>("chatMessages").valueChanges(["added"])
    }

    deleteChatMessage(account: string, messageId: string): Promise<void> {
        return this.adminCollection.doc(account).collection<ChatMessage>("chatMessages").doc(messageId).delete()
    }

    async publishChatMessage(chatMessage: ChatMessage): Promise<any> {
        return this.http.post(this.url + "/publishChatTopic", chatMessage).toPromise()
    }

    async publishPostMessage(chatMessage: ChatMessage): Promise<any> {
        this.http.post(this.url + "/publishPostTopic", chatMessage).toPromise()
    }

    async getSQLiteDB(): Promise<SQLiteObject> {
        const sqliteDB = await this.sqlite.create({
            name: "MESSAGE.RECORD.db",
            location: "default"
        })
        await sqliteDB.executeSql("CREATE TABLE IF NOT EXISTS Message (id VARCHAR UNIQUE, sender VARCHAR, receiver VARCHAR, message VARCHAR, timestamp INTEGER)", [])
        return Promise.resolve(sqliteDB)
    }

    async insertChatMessageToSQLiteDB(chatMessage: ChatMessage): Promise<void> {
        const sqliteDB = await this.getSQLiteDB()
        console.log(JSON.stringify(chatMessage, null, 4))
        return sqliteDB.executeSql("INSERT OR IGNORE INTO Message(id, sender, receiver, message, timestamp) VALUES(?, ?, ?, ?, ?)", [chatMessage.id, chatMessage.sender, chatMessage.receiver, chatMessage.message, chatMessage.timestamp])
    }

    async getChatMessageFromSQLiteDB(myAccount: string, chatAccount: string): Promise<ChatMessage[]> {
        const sqliteDB = await this.getSQLiteDB()
        const values = await sqliteDB.executeSql("SELECT * FROM Message WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?) ORDER BY timestamp ASC", [myAccount, chatAccount, chatAccount, myAccount])
        const chatMessages = new Array<ChatMessage>()
        for (let index = 0; index < values.rows.length; index++)
            chatMessages.push(values.rows.item(index))
        return chatMessages
    }

    async addChatMember(member: Member, anotherMember: Member, isFriend: boolean): Promise<any> {
        var members = {
            member,
            anotherMember,
            isFriend
        }
        return this.http.post(this.url + "/addChatMember", members).toPromise()
    }

    getChatMembers(account: string): Observable<ChatMember[]> {
        return this.adminCollection.doc(account).collection<ChatMember>("chatMembers").valueChanges()
    }

    getChatMember(account: string, chatAccount: string): Observable<ChatMember> {
        return this.adminCollection.doc<Admin>(account).collection<ChatMember>("chatMembers").doc<ChatMember>(chatAccount).valueChanges()
    }
}