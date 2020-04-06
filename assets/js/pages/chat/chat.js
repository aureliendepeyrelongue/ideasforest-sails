/* eslint-disable linebreak-style */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */



Vue.component('last-message', {

  props: ['room'],

  data() {
    return {
      room_ : this.room
    };

  },

  template: `<div class="chat_list">
                        <div class="chat_people">
                            <div class="chat_img"> <img :src="room.incomingUser.profile.avatar"
                                    alt="sunil"> </div>
                            <div class="chat_ib">
                                <h5>{{room_.incomingUser.fullName}} <span class="chat_date">{{computedLastMessage.createdAt}}</span></h5>
                                <p>{{computedLastMessage.content}}</p>
                            </div>
                        </div>
                    </div>
                    `,
  computed: {
    computedLastMessage(){
      if(this.room_.messages.length)
      {
        return this.room_.messages[this.room_.messages.length-1];
      }
      else
      {
        return {content : '', createdAt :''};
      }
    }
  }
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
                                <span class="time_date"> {{message.createdAt}} </span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="outgoing_msg">
                        <div class="sent_msg">
                            <p>{{message.content}}</p>
                            <span class="time_date"> {{message.createdAt}}</span>
                        </div>
                    </div>
                    </div>
                    `,


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
                        <input type="text" class="write_msg" v-on:keyup.enter="sendMessage" v-model="message" placeholder="Écrire un message" />
                        <button class="msg_send_btn" type="button" @click="sendMessage"><i class="fa fa-paper-plane-o"
                                aria-hidden="true"></i></button>
                    </div>
                </div>
                      `,

  methods : {
    sendMessage(){
      if(this.message != ''){
        this.$emit('sendmessage', this.message);
        this.message = '';
      }
    }
  }
});

var app = new Vue({
  el: '#chat-app',
  data: {
    user : { rooms : []},
    activeRoom: {
      room: {},
      messages: [],
      incomingUser: {}
    },
  },
  async mounted() {
    io.socket.get('/api/rooms/chat-messages/connection');
    io.socket.get('/api/rooms/new/connection');
    var res = await axios.get('/api/chat-messages');
    this.user = res.data;
    this.user.rooms = this.user.rooms.reverse();
    this.user.rooms.forEach(room => {
      this.prepareRoom(room);
    });
    this.scrollMessage();

    io.socket.on('chat-message', (chatMessage) => {
      this.user.rooms.forEach(room =>{
        if(room.id == chatMessage.room){
          room.messages.push(chatMessage);
        }
      });
      this.scrollMessage();
    });

    io.socket.on('new-room', (newRoom) =>{
      this.prepareRoom(newRoom);
      this.user.rooms.unshift(newRoom);
      io.socket.post('/api/rooms/new/chat-messages/connection',{roomId:newRoom.id});
    });

  },
  methods: {
    prepareRoom(room){
      room.users.forEach(inuser => {
        if(inuser.id !== this.user.id){
          room.incomingUser = inuser;
        }
      });
      if(this.user.lastSelectedRoom && this.user.lastSelectedRoom.room == room.id){
        this.activeRoom = room;
      }
    },
    setActiveRoom(room){
      this.activeRoom = room;
      io.socket.put('/api/last-selected-rooms',{roomId:room.id});
      this.scrollMessage();
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

    },
    scrollMessage(){
      this.$nextTick(function () {
        this.$refs.messageContainerScroll.scrollTop = this.$refs.messageContainerScroll.scrollHeight;
      });
    }
  }

});


