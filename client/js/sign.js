


Template.login.events({
  "submit #loginform": function (event) {
      event.preventDefault();
 		
      
      var email = event.target.email.value;
      var password = event.target.password.value;
    	
    	Meteor.loginWithPassword(email, password, function(err){
    		console.log("You initiated the login process.");
        if (err){
            alert ("Wrong username or password.");
        }else{
                Router.go('/dashboard');
        }
		});
    },
    'click #register': function (e) {
        e.preventDefault();
        Router.go('/register');
    }
});




Template.register.events({
  "submit #registerform": function (event) {
      event.preventDefault();
    
      var firstName = event.target.firstName.value;
     
      
      var lastName = event.target.lastName.value;
      var email = event.target.email.value;
      
      var password = event.target.password.value;
      var confirmPassword = event.target.confirmPassword.value;
    
      if (password != confirmPassword){
        alert ("Passwords do not match.");
      }else{
          Accounts.createUser({
            email: email,
            password: password
           });
          Meteor.call("addUser", firstName, lastName, email);
          
          alert ("Account created!");
      }   
      
    },
    'click #login': function (e) {
        e.preventDefault();
        Router.go('/login');
    }


});
