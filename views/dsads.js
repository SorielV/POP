const project = window.location.pathname.split('/')[2]

Vue.component('comment', {
	template: 
    `<div class="col-12">
	    <div class="row">
	      <div class="col-2">
	        <div class="chip">
	          <img src="http://localhost:3000/img/user/err.png" class="">
	          <a :href="'/profile/' + comment.username"><strong v-text="comment.username"></strong></a>
	        </div>
	      </div>
	      <div class="col-9 col-sm-9">
	      	<div class="row">	
		        <div class="col-11" v-text="comment.content">
		        </div>
		        <div class="col-1 float-right" v-if="username == comment.username">
	  					<a class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a>
	  						<div class="dropdown-menu">
	    						<a class="dropdown-item" href="#">Edit</a>
	     						<a class="dropdown-item" href="#">Delete</a>
								</div>
						</div>
					</div>
	      </div>
	    </div>
	  </div>`,
	props: {
		comment: Object, 
		index: Number
	},
	data: function() {
		return {
			show : false
		}
	},
	computed: {
		username : function() {
			return username
		}
	},
	methods: {
		onCreateComment: function() {
			this.$emit('create-comment', this.index)
		},
		onUpdateComment: function() {
			this.$emit('update-comment', this.index)
		},
		onDeleteComment: function() {
			this.$emit('delete-comment', this.index)
		}
	}
});

Vue.component('post', {
	template: 
		`<div class="card news-card">
      <div class="card-body">
          <div class="content">
              <div class="right-side-meta">14 h
              	<div class="float-right" v-if="post.username == username">
	  							<a class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a>
	  						<div class="dropdown-menu">
	    						<a class="dropdown-item" @click="update">Edit</a>
	     						<a class="dropdown-item" @click="remove">Delete</a>
								</div>
								</div>
              </div>
              <img src="https://mdbootstrap.com/img/Photos/Avatars/img%20(17)-mini.jpg" class="rounded-circle avatar-img z-depth-1-half">
              <a :href="'/profile/' + post.username">
              	<span v-text="post.username"></span></a>
              <a :href="'/project/' + post.project">
              	<span v-text="'<' + post.project + '>'" ></span>	
              </a>
               
          </div>
      </div>

      <div class="card-body mid">
        <div class="social-meta">
        		<h4><strong v-text="post.title"></strong></h4>
            <p v-text="post.content"></p>
            <p>
            	<a @click="show = !show">
            		<i class="fa fa-comment"></i>
            	</a><span v-text="count"></span> comments
            </p>
        </div>
        <div class="md-form end">
        		<div v-show="show">
        			<hr>
        			<template v-for="(comment, $index) in comments">	
        					<comment :index="$index" :comment="comment"></comment> 
        			</template>
        			<hr>			
        		</div>
        		<div class="row">	
        			<div class="col-1">	
        				<img src="https://mdbootstrap.com/img/Photos/Avatars/img%20(17)-mini.jpg" class="rem">
        			</div>
        			<div class="col-11"> 	
      					<input placeholder="Add Comment..." type="text" class="form-control" @keyup.enter="createComment" v-model="comment.content">
        			</div>
        		</div>
        </div>
      </div>
		</div>`,
	props: {
		post: Object,
		index: Number
	},
	data: function() {
		return {
			show: false,
			comments : Array,
			comment : { content : '' }, //v-model
			cindex: null
		}
	},
	computed: {
		count: function() {
			return this.comments.length;
		},
		username: function() {
			return username
		}

	},
	created: function() {
		this.$http.get(`/api/comment/post/${this.post._id}`)
		.then( response => {
			this.comments = response.data
		})
		.catch((err) => {
			console.log(err)
			this.comments = []
		})		
	},
	methods: {
		/* Post */
		update: function() {
			this.$emit('edit-post', this.index)
		},
		remove: function() {
			this.$emit('delete-post', this.index)
		},
		/* /Post */

		/* Comments */
		createComment: function() {
			this.$http.post(`/api/comment/post/${this.post._id}`, this.comment) 
			.then( response => {
				this.comments.push(response.data)
				this.comment = {} //Empty
				this.show = true
			})
			.catch(err => {
				//Alert
				console.log(err)
			})
		},
		viewCommnets: function() {
			this.$http.get(`/api/comment/post/${this.post._id}`)
			.then( response => {
				this.comments = response.data
			})
			.catch((err) => {
				console.log(err)
				this.comments = ''
			})
		},
		onUpdateComment: function($index) {
			this.comment = this.comments[$index]; // ^Reactive 
			this.cindex = $index
			//Show modal @v-submit:prevent-e="updateComment"
		},
		updateComment: function($index) {
			//Return update comment
			this.$http.put(`/api/comment/${this.comment._id}`, this.comment)
			.then(response => { 
				this.comments[this.index] = response.data
				this.comment = {} // Empty
				this.index = -1; // Invalid
			})
			.catch(err => {
				console.log(err)
			})
		},
		deleteComment: function($index) {
			this.$http.delete(`/api/comment/${this.comments[$index]._id}`)
			.then(response => { 
				this.comments.pop($index);
			})
			.catch(err => {
				console.log(err)
			})
		}
		/* /Comments */
	}
});

Vue.component('posts', {
	template: 
		`<div v-if="!error">
			<div class="card">
       	<h6 class="card-header elegant-color-dark white-text">Create Post</h6>
          <div class="card-body">                            
            <div class="row">
              <form class="col-12" v-on:submit.prevent="createPost">
                <div class="md-form">
                  <input type="text" class="form-control" v-model="post.title" required="true">
                  <label class="active">Titulo</label>
                </div>
                    
                <div class="md-form">
                  <textarea type="text" class="md-textarea" v-model="post.content" required="true"></textarea>
                  <label class="active" for="content">Contenido</label>
                </div>

                <div class="md-form">
                  <button type="submit" class="btn special-color-dark btn-lg btn-block">Create Post</button>
                </div>
              </form>
            </div>
          </div>    
        </div>
        <br>
        <div class="li-post">
					<div class="col-12">
						<template v-for="(post, $index) in posts">
							<post @edit-post="editPost" @delete-post="removePost" :index="$index" :post="post"></post>
						</template>
						<br>
						<div class="modal fade" ref="modal" id="editPost" tabindex="-1" role="dialog" aria-hidden="true">
					    <div class="modal-dialog modal-notify modal-danger" role="document">
					      <div class="modal-content">
					        <div class="modal-header">
					          <p class="heading lead">Edit Post</p>
					            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
					              <span aria-hidden="true" class="white-text">&times;</span>
					            </button>
					        </div>
					        <div class="modal-body">
					          <form class="col-12" v-on:submit.prevent="updatePost">
					            <div class="md-form">
					              <input type="text" class="form-control" v-model="post.title" required="true">
					              <label class="enable">Titulo</label>
					            </div>
					                
					            <div class="md-form">
					              <textarea type="text" class="md-textarea" v-model="post.content" required="true"></textarea>
					              <label class="enable" for="content">Contenido</label>
					            </div>
					            <button type="submit" class="btn btn-primary-modal">Update <i class="fa fa"></i></button>
					            <button type="button" class="btn btn-outline-secondary-modal waves-effect" data-dismiss="modal">Cancel</button>
					          </form>
					        </div>
					      </div>
					    </div>
			  		</div>
					</div>
			</div>
		</div>`,
	data: function() {
		return {
			posts: [],
			post: {},
			edit: {},
			index: Number,
			update: false,
			error: false
		}
	},
	computed: {
		project: function() {
			return project
		}
	},
	created: function() {
		this.$http.get(`/api/post/project/${this.project}`)
		.then(response => {
			//Paginacion futur response.data.data
			this.posts = response.data
		})
		.catch((err) => {
			console.log(err)
			this.posts = []
			this.error = true
		})
	},
	methods: {
		createPost: function() { 
			this.post.project = project;
			this.$http.post('/api/post', this.post)
			.then(response => {
				this.posts.push(response.data)
				this.post = {}
			})
			.catch(err => {
				console.log(err)
			})
		},
		editPost: function($index) {
			this.update = false
			this.index = $index
			this.post = this.posts[$index] //No Reactive
			this.edit = JSON.parse(JSON.stringify(this.posts[$index])) //No Reactive
			$('#editPost').modal('show')
		},
		removePost: function($index) {
			this.$http.delete(`/api/post/${this.posts[$index]._id}`)
			.then(response => {
				this.posts.splice($index, 1)
			})
			.catch(err => {
				console.log(err)
			})
		},
		updatePost: function() {
			console.log('update')
			this.$http.put(`/api/post/${this.post._id}`, this.post)
			.then(response => {
				this.posts[this.index] = response.data
				this.update = true
				this.post = {}
			})
			.catch(err => {

				console.log(err)
			})
			$('#editPost').modal('hide')
		},
		modalClose: function() {
			if(!this.update) {
				this.$set(this.posts, this.index, JSON.parse(JSON.stringify(this.edit)))
			}
			this.post = {}
		}
	},
	mounted: function() {
		$(this.$refs.modal).on("hidden.bs.modal", this.modalClose)
	}
})

new Vue({
	el: "#app",
	componets: {
		/*'post' : { post },
		'comment': { comment }*/
	},
	data: {
		index: Number,
		project: String,
		members: Array,
		posts: Array,
		post: {} //'v-model'
	},
	/*created: function() {
		this.project = window.location.pathname.split('/')[2] 

		this.$http.get(`/api/post/project/${this.project}`)
		.then(response => {
			//Paginacion futur response.data.data
			this.posts = response.data
		})
		.catch((err) => {
			console.log(err)
			this.posts = ''
		})

	},*/
	
})

/*
  $scope.addMember = () => {
    console.log($scope.member);
    $http.post(`/api/request/project/${project}/${$scope.member}`)
    .then((res) => { 
        console.log('Solicitud Enviada C:');
        //$scope.comments[$index] = res.data;
        //console.log($scope.comments[$index]);
    })
    .catch((err) => {

    });
  };
*/