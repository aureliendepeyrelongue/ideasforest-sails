/* eslint-disable linebreak-style */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */

io.socket.get('/api/chat-messages/connect');


Vue.component('likes-button', {
  props: ['liked','id', 'likes'],
  data(){
    return {
      liked_ : this.liked || false,
      id_ : this.id,
      likes_ : this.likes || 0
    };
  },
  template: `<button class="likes-button" :class="computedClasses" 
  @click="sendLike"
  title="Connectez ou inscrivez-vous pour liker.">
  <span class="fa fa-heart"></span>
  {{likes_}}
 </button> 
`,

  methods: {
    async sendLike(){
      var res = await axios.post('/api/post/likes',{
        postId : this.id_,
        _csrf: window.SAILS_LOCALS._csrf
      });
      this.liked_ = res.data.liked;
      this.likes_ = res.data.likes;
    },
  },
  computed: {
    computedClasses(){
      if(this.liked_){
        return 'liked';
      }
    }
  }

});

var app = new Vue({
  el: '#likes-app'

});


