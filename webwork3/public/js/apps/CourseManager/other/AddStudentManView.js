// This is the View for the dialog for addings students manually    

define(['backbone', 'underscore','models/User','models/UserList','views/ModalView', 'config','stickit'], 
	function(Backbone, _, User, UserList,ModalView,config){	
	var AddStudentManView = ModalView.extend({
		id: "addStudManDialog",	    
		initialize: function(options){
		    var self=this;
		    _.bindAll(this, 'render','saveAndClose','saveAndAddStudent'); // every function that uses 'this' as the current object should be in here
		    _(this).extend(_(options).pick("users","messageTemplate"));
		    this.collection = new UserList();
		    this.model = new User();
		    this.invBindings = _.extend(_.invert(_.omit(this.bindings,".permission")),
        		{"user_id": ".user-id", "email_address": ".email"});

		    
            _(options).extend({
            	modal_size: "modal-lg",
	            modal_header: "Add Users to Course",
	            modal_body: $("#manual-import-template").html(),
	            modal_buttons: $("#manual-import-buttons").html()
	        })
	        this.setValidation();
            ModalView.prototype.initialize.apply(this,[options]);
		},
		childEvents: {
		    "click .action-button": "saveAndClose",
		    "click .add-more-button": "saveAndAddStudent",
		},
		setValidation: function (){
			var self = this;
			Backbone.Validation.bind(this, {
		    	invalid: function(view,attr,error){
		    		self.$(self.invBindings[attr]).popover({placement: "right", content: error})
                    	.popover("show").addClass("error");
		    	},
		    	valid: function(view,attr){
		    		self.$(self.invBindings[attr]).popover("destroy").removeClass("error");
		    	}
		    });
		},
		render: function(){
			var self = this;
			ModalView.prototype.render.apply(this);
			this.stickit();
		},
    	bindings : { ".student-id": "student_id",
			".last-name": "last_name",    		
			".first-name": "first_name",
			".status": "status",
			".comment": "comment",
			".status": "status",
			".recitation": "recitation",
			".email": {observe: "email_address", setOptions: {silent:true}},
			".user-id": {observe: "user_id", setOptions: {silent:true}},
			".password": "password",
			".permission": { 
				observe: "permission",
				selectOptions: { collection: function() { return config.permissions;}}
			}
		},

		saveAndClose: function(){ 
			this.saveAndAddStudent();
			this.users.add(this.collection.models);
			this.collection.reset();
			this.close();		    
		},
		saveAndAddStudent: function (){ 
			if(this.users.findWhere({user_id: this.model.get("user_id")})){
				this.$(".message-pane").addClass("alert-error").html(this.messageTemplate({type:"user_already_exists",
								opts: {user_id: this.model.get("user_id")}}));
			}
			if(this.model.isValid(true)){
				this.collection.add(new User(this.model.attributes));
				this.$(".message-pane").addClass("alert-info").html(this.messageTemplate({type: "man_user_added",
								opts: {users: this.collection.pluck("user_id")}}));
				
				this.model = new User();
				this.setValidation();
				this.stickit();
			}
		}
    });
    return AddStudentManView;

});
    