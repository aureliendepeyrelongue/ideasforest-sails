/* eslint-disable linebreak-style */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */

io.socket.get('/api/chat-messages/connect');


Vue.component('posted-comment', {
  props: ['comment'],
  template: `<div class="col-md-12">
  <div class=" content-section">
      <div><img class="rounded-circle article-img" v-bind:src="comment.author.profile.avatar" alt="">
          <a class="mr-2" href="#">{{ comment.author.fullName }}</a>
          <small class="text-muted">14 February 2020</small></div>
      <p>{{ comment.content }}</p>
  </div>
</div>`
});

var app2 = new Vue({
  el: '#comments-app',
  data : {
    postedComments : [],
    content : ''
  },
  methods : {
    async postComment(){
      var res = await axios.post('/api/post/comments',{
        postId : this.getPostIdComputed,
        content : this.content,
        _csrf: window.SAILS_LOCALS._csrf
      });
      this.postedComments.push(res.data.comment);
      this.content = '';
    }
  },
  computed : {
    getPostIdComputed(){
      var arr = window.location.href.split('/');
      var val;
      if(arr[arr.length-1]){
        val = arr[arr.length-1];
      }
      else{
        val = arr[arr.length-2];
      }
      return val;
    }
  }

});


