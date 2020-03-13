

io.socket.get('/api/chat-messages/connect');

Vue.component('last-message', {

  props: ['room'],
  template: `<div class="chat_list">
                        <div class="chat_people">
                            <div class="chat_img"> <img :src="room.incomingUser.profile.avatar"
                                    alt="sunil"> </div>
                            <div class="chat_ib">
                                <h5>{{room.incomingUser.fullName}} <span class="chat_date">Dec 25</span></h5>
                                <p>{{room.lastMessage.content}}</p>
                            </div>
                        </div>
                    </div>
                    `
});

Vue.component('message', {

  props: ['message', 'inuser'],
  template: `
        <div>
        <div v-if="inuser.id==message.author.id" class="incoming_msg">
                        <div class="incoming_msg_img"> <img :src="inuser.profile.avatar"
                                alt="sunil"> </div>
                        <div class="received_msg">
                            <div class="received_withd_msg">
                                <p>{{message.content}}</p>
                                <span class="time_date"> 11:01 AM | Today</span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="outgoing_msg">
                        <div class="sent_msg">
                            <p>{{message.content}}</p>
                            <span class="time_date"> 11:01 AM | Today</span>
                        </div>
                    </div>
                    </div>
                    `
});

Vue.component('writer', {

  data(){
    return {
      message : ''
    };
  },

  template: `
           <div class="type_msg">
                    <div class="input_msg_write">
                        <input type="text" class="write_msg" v-model="message" placeholder="Type a message" />
                        <button class="msg_send_btn" type="button" @click="sendMessage"><i class="fa fa-paper-plane-o"
                                aria-hidden="true"></i></button>
                    </div>
                </div>
                      `,

  methods : {
    sendMessage(){
      if(this.message != ''){
        this.$emit('sendmessage', this.message);
      }
    }

  }
});

var app = new Vue({
  el: '#chat-app',
  data: {
    rooms : [],
    activeRoom: {
      room: {},
      messages: [],
      incomingUser: {},
      lastMessage: {}
    },
  },
  async mounted() {
    var res = await axios.get('/api/chat-messages');
    var user = res.data;
    this.rooms = user.rooms;
    this.rooms.forEach(room => {
      room.users.forEach(inuser => {
        if(inuser.id !== user.id){
          room.incomingUser = inuser;
        }
      });
      room.lastMessage = room.messages[room.messages.length-1];
    });

    io.socket.on('message', (chatMessage) => {
      this.rooms.forEach(room =>{
        if(room.id == chatMessage.room){
          room.messages.push(chatMessage);
        }
      });
    });

  },
  methods: {
    setActiveRoom(room){
      this.activeRoom = room;
    },
    getActiveClass(roomId) {
      if (roomId == this.activeRoom.id)
      {return 'active_chat';}
      return '';
    },
    sendMessage(message){
      io.socket.post('/api/chat-messages', {
        message,
        roomId : this.activeRoom.id
      },(resData, jwRes) => {
        if (jwRes.statusCode != 200) {

        } else {

        }
      });
    }
  }

});


