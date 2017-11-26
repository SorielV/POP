Vue.component('edit-project' ,{
	template: 
		`<div class="modal fade show" id="editProject" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
			  <div class="modal-dialog cascading-modal modal-md" role="document">
			    <div class="modal-content">
			      <form action="/project" method="post">
			        <div class="modal-header bg-dark darken-3 white-text">
			          <h4 class="title"><i class="fa fa-pencil"></i>Edith Project</h4>
			          <button type="button" class="close waves-effect waves-light" data-dismiss="modal" aria-label="Close">
			              <span aria-hidden="true">×</span>
			          </button>
			        </div>
			        <div class="modal-body mb-0">
			          <div class="md-form">
		              <i class="fa fa-plus-square prefix" aria-hidden="true"></i>
		              <input type="text" id="f1" name="title" v-model="project.title" class="form-control" placeholder="Nombre del Proyecto" required>
			          </div>

			          <div class="md-form">
		              <i class="fa fa-tags prefix" aria-hidden="true"></i>
		              <input type="text" class="form-control" id="for6" name="tag" v-model="project.tag" placeholder="Proyecto" required>
			          </div>

			          <div class="md-form">
		              <i class="fa fa-sort-desc prefix" aria-hidden="true"></i>
		              <textarea type="text" id="axaa" name="description" v-model="project.description" class="md-textarea mb-0" placeholder="Descripcion"></textarea>
			          </div>

			          <div class="md-form">
		              <i class="fa fa-file-image-o prefix" aria-hidden="true"></i>
		              <input class="form-control" name="img" v-model="project.img" type="url" value="" id="img" placeholder="Imagen del Proyecto" required>
			          </div>

			          <div class="text-center mt-1-half">
		              <button type="submit" class="btn btn-info mb-2 waves-effect waves-light">
		                <i class="fa fa-send ml-1">Actualizar</i>
		              </button>
			          </div>
			        </div>
			      </form>
			    </div>
			  </div>
			</div>`,
	props: ['api'],
	data: function() {
		return {
			project: Array
		}
	},
	methods: {
		updateProejct: function() {
		 	console.log('It will be later')
		}	
	},
	created: function() {
		this.$http.get(this.api)
		.then(response => {
			this.project = response.data
		}) 
		.catch(err => {
			this.project = []
		})
	},
})