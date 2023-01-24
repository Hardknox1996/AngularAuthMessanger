import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AppComponent } from 'src/app/app.component';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map, take } from 'rxjs';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { merge } from 'jquery';

@Component({
  selector: 'app-messagecenter',
  templateUrl: './messagecenter.component.html',
  styleUrls: ['./messagecenter.component.css']
})
export class MessagecenterComponent implements OnInit {

  userData: any = this.auth.userData

  uid: any = ""
  displayName: any = ""
  email: any = ""
  photoURL: any = ""
  resetPhotoURL: any = ""
  accessToDash: any = ""
  emailVerified: any = ""
  birthDate: any = ""
  updateProfile: any = ""
  startDate: any
  contactNumber: any

  defaultPhotoMe = this.auth.userProfileImage

  allUsers: any
  printUsers: any

  loadView: any = false
  currentOpenChatOf: any
  currentChatUserId: any


  findChat: any

  constructor(
    public router: Router,
    private auth: AuthService,
    public afs: AngularFirestore,
    private mainApp: AppComponent,
    public dialog: MatDialog,
    public fireStorage: AngularFireStorage,

  ) { }

  ngOnInit(): void {
    // Map All Values
    this.setValuesUpdated()
    this.getAllUsers()
    this.updateRealTimeChat()

    // Recall User Data on update
    this.auth.updatedUserData.subscribe((data) => {
      this.userData = this.auth.updateUserProfile()
      this.setValuesUpdated()
    })


  }

  setValuesUpdated() {

    if (this.userData.accessToDash) {
      this.loadView = true
    }
    this.uid = this.userData.uid
    this.displayName = this.userData.displayName || "User"
    this.email = this.userData.email
    this.photoURL = this.userData.photoURL || this.auth.userProfileImage
    this.resetPhotoURL = this.userData.photoURL || this.auth.userProfileImage
    this.accessToDash = this.userData.accessToDash
    this.emailVerified = this.userData.emailVerified
    this.birthDate = this.userData.birthDate
    this.contactNumber = this.userData.phoneNumber

    // this.lazyLoading = this.auth.userPrifileLoading

    let setBirthday = this.birthDate
    this.startDate = new Date(setBirthday)

    this.auth.showProgressBar(false)



  }

  getAllUsers() {
    try {
      this.afs.collection('users').valueChanges().pipe(take(1)).subscribe(listUsers => {
        // console.log(listUsers)
        listUsers = listUsers.sort(function (x:any, y:any) {
          return y.lastMgsOn - x.lastMgsOn;
        })
        this.allUsers = listUsers
        this.printUsers = listUsers

        this.checkAllUnSeens()

      })
    } catch (err) {
      console.log(err)
    }
  }

  checkAllUnSeens() {
    for (let i = 0; i < this.allUsers.length; i++) {
      let currentUser = this.allUsers[i]
      if (currentUser.uid != this.uid) {
        // getIDs.push()

        let dataForCount: any
        let ChatIdForLoop = this.createChatIDCombos(currentUser.uid)

        try {
          this.afs.doc(`messageCenter/${ChatIdForLoop}/unseenBy/${this.uid}/`).valueChanges().pipe(take(1)).subscribe(data => {
            dataForCount = data

            let currentUnseen = 0
            let currentTimeStamp = 0
            if (data) {
              currentUnseen = parseInt(dataForCount.unseenCount)
              currentTimeStamp = dataForCount.lastMessageOn
            }
            Object.keys(this.allUsers).forEach((item) => {
              if (this.allUsers[item].uid == currentUser.uid) {
                this.allUsers[item]['chatBoxWithMe'] = ChatIdForLoop
                this.allUsers[item]['unReadMessages'] = currentUnseen
                this.allUsers[item]['lastMgsOn'] = currentTimeStamp

                // console.log(this.allUsers[item])
              }
            })

            this.allUsers.sort(function (x:any, y:any) {
              return y.lastMgsOn - x.lastMgsOn;
            })
            this.printUsers = this.allUsers
            console.log(this.printUsers)
          })
        } catch (err) {
          console.log(err)
        }
      }

    }



  }



  createChatIDCombos(chatuserId: any) {
    if (chatuserId > this.uid) {
      return chatuserId + this.uid
    } else {
      return this.uid + chatuserId
    }
  }



  updateUsersListTemo() {
    if (this.findChat) {
      this.printUsers = []
      for (let i = 0; i < this.allUsers.length; i++) {
        let currentUser = this.allUsers[i]
        if (currentUser.uid != this.uid) {
          if (currentUser.displayName.toLowerCase().includes(this.findChat.toLowerCase()) || currentUser.email.includes(this.findChat)) {
            this.printUsers.push(currentUser)
          }
        }
      }
    }
    else {
      this.printUsers = this.allUsers
    }
  }
  clearChatFind() {
    this.findChat = '';
    this.updateUsersListTemo()
  }




  currentChatOpenUid: any
  openCharWith(chatuserId: any) {
    this.currentChatOpenUid = chatuserId
    this.auth.currentChatOpen = chatuserId
    if (chatuserId > this.uid) {
      this.currentOpenChatOf = chatuserId + this.uid
      this.auth.currentOpenChatForSoket = chatuserId + this.uid
    } else {
      this.currentOpenChatOf = this.uid + chatuserId
      this.auth.currentOpenChatForSoket = this.uid + chatuserId
    }
    this.showMessagesOf(this.currentOpenChatOf, chatuserId)
    this.getTypedMessge = ""
  }



  checkBoxIsActive: any
  showMessagesOf(getChatId: any, chatuserId: any) {

    for (let i = 0; i < this.allUsers.length; i++) {
      let currentUser = this.allUsers[i]
      if (currentUser.uid == chatuserId) {
        this.currentChatUserId = currentUser
        // console.log(getChatId)
      }
    }
    this.scrolltoBottomChatBox()
    this.checkIfChatBoxExist(getChatId)
    this.checkBoxIsActive = true
  }
  closeChatBox(){
    this.checkBoxIsActive = false
    this.currentOpenChatOf = ''
  }


  getTypedMessge: any
  sendMessageTo(getChatBoxID: any, sendToThisUid: any) {
    try {
      if (this.getTypedMessge) {
        let megsTime = Date.now()
        var d = new Date,
          dformat = [d.getDate(),
          d.getMonth() + 1,
          d.getFullYear()].join('/') + ' ' +
            [d.getHours(),
            d.getMinutes()].join(':');
        let chatBox = this.afs.doc(`messageCenter/${getChatBoxID}/massages/new${megsTime}/`)
        let chatBox2 = this.afs.doc(`messageCenter/${getChatBoxID}/unseenBy/${sendToThisUid}/`)
        // let messageID = Date.now() {}
        let messageData = {
          messageBody: this.getTypedMessge,
          messageDateTime: dformat,
          messageFrom: this.uid,
          readyByReceiver: false
        };
        chatBox.set(messageData, {
          merge: true,
        }).then(val => {
          this.auth.websoketPanel(sendToThisUid, this.getTypedMessge)
          this.checkIfChatBoxExist(getChatBoxID)
          this.getTypedMessge = ""
        });

        let dataForCount: any

        try {
          this.afs.doc(`messageCenter/${getChatBoxID}/unseenBy/${sendToThisUid}/`).valueChanges().pipe(take(1)).subscribe(data => {
            dataForCount = data
            let currentUnseen = 1
            if (data) {
              currentUnseen = parseInt(dataForCount.unseenCount)
              currentUnseen = currentUnseen + 1
            }
            let count = {
              unseenCount: currentUnseen,
              lastMessageOn: Date.now()
            }
            chatBox2.set(count, {
              merge: true
            }).then(val => {
              //
            });
          })
        } catch (err) {
          console.log(err)
        }


      }
    }
    catch (err) {
      console.log(err)
    }
  }



  chatboxShowThisMessges: any
  checkIfChatBoxExist(getChatId: any) {
    try {
      let megsTime = Date.now().toString()
      this.afs.collection(`messageCenter`).doc(getChatId).collection(`massages`, ref => {
        return ref.orderBy('messageDateTime', 'desc').limit(15);
      }).valueChanges().pipe(take(1)).subscribe(val => {
        if (val) {
          let changeOrderMsg = []
          for (let i = val.length - 1; i >= 0; i--) {
            changeOrderMsg.push(val[i])
          }
          console.log(changeOrderMsg)
          if (getChatId == this.currentOpenChatOf) {
            this.chatboxShowThisMessges = changeOrderMsg
            let dataForCount: any
            let chatBox2 = this.afs.doc(`messageCenter/${getChatId}/unseenBy/${this.uid}/`)
            try {
              chatBox2.valueChanges().pipe(take(1)).subscribe(data => {
                dataForCount = data
                let currentUnseen = 0
                let count = {
                  unseenCount: currentUnseen
                }
                chatBox2.set(count, {
                  merge: true
                }).then(val => {
                  this.checkAllUnSeens()
                });
              })
            } catch (err) {
              console.log(err)
            }
          }
          this.scrolltoBottomChatBox()
        }
        else {
          console.log('Creating Chatbox', val)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  realTimeDB = getDatabase();
  updateRealTimeChat() {

    try {
      const starCountRef = ref(this.realTimeDB, `${this.userData.uid}`);
      onValue(starCountRef, (snapshot) => {
        const data: any = snapshot.val();
        try {
          if (data.messageData) {
            this.checkIfChatBoxExist(data.chaboxId)
            this.checkAllUnSeens()
          }
        }
        catch (err) {
          console.log(err)
        }

      })
    }
    catch (err) {
      console.log(err)
    }
  }

  scrolltoBottomChatBox() {
    setTimeout(() => {
      // console.log('scroll')
      let element = document.getElementById("scrolltoLast");
      element?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }, 500)


  }



}


