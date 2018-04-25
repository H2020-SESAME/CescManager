
Router.configure({
    layoutTemplate: 'layout',
    
});

Router.route('/', function () {
  this.render('login');
});


Router.route('/index');
Router.route('/login');
Router.route('/register');



Router.route('/catalogns', function () {
  this.render('applayout', {to: 'main'});
  this.render('catalogns', {to: 'content'});
});
Router.route('/catalogvnf', function () {
  this.render('applayout', {to: 'main'});
  this.render('catalogvnf', {to: 'content'});
});




Router.route('/operationalns', function () {
  this.render('applayout', {to: 'main'});
  this.render('operationalns', {to: 'content'});
});





Router.route('/monitoringcompute', function () {
  this.render('applayout', {to: 'main'});
  this.render('monitoringcompute', {to: 'content'});
});
Router.route('/monitoringnetwork', function () {
  this.render('applayout', {to: 'main'});
  this.render('monitoringnetwork', {to: 'content'});
});
Router.route('/monitoringns', function () {
  this.render('applayout', {to: 'main'});
  this.render('monitoringns', {to: 'content'});
});
Router.route('/monitoringvnf', function () {
  this.render('applayout', {to: 'main'});
  this.render('monitoringvnf', {to: 'content'});
});


Router.route('/dashboard', function () {
  this.render('applayout', {to: 'main'});
  this.render('dashboard', {to: 'content'});
});


Router.route('/multitenancy', function () {
  this.render('applayout', {to: 'main'});
  this.render('dashboard', {to: 'content'});
});

Router.route('/qos', function () {
  this.render('applayout', {to: 'main'});
  this.render('qos', {to: 'content'});
});

Router.route('/tenor', function () {
  this.render('applayout', {to: 'main'});
  this.render('tenor', {to: 'content'});
});



/*

Router.route('/operationalns', {
	yieldRegions: {
    'applayout': {to: 'main'},
    'operationalns': {to: 'content'}
  },
	
	waitOn: function () {
        return Meteor.subscribe('networkservices');
    },
    
    data: function(){

        if (this.ready()) {
        //console.log(this.params.deviceid);
        //var currentDevice = this.params.deviceid;
        //console.log(Geodatafinal.findOne({deviceid: currentDevice}, {sort: {createdAt: -1}, limit: 1}).fetch());
        //Session.set("devid", this.params.deviceid);

          return NetworkServices.find();
        }
    }
});
*/

Router.route('/networkservices',{where: 'server'})
    .get(function(){
        var response = NetworkServices.find().fetch();
        this.response.setHeader('Content-Type','application/json');
        this.response.end(JSON.stringify(response));
    })
	
	.post(function(){
        var response;
        if(this.request.body.userName === undefined || this.request.body.userPassword === undefined) {
            response = {
                "error" : true,
                "message" : "invalid data"
            };
        } else {
            User.insert({
                UserName : this.request.body.userName,
                UserPassword : this.request.body.userPassword
            });
            response = {
                "error" : false,
                "message" : "User added."
            }
        }
        this.response.setHeader('Content-Type','application/json');
        this.response.end(JSON.stringify(response));
 });
 
 Router.route('/violations',{where: 'server'})
    .get(function(){
        var response = Violations.find().fetch();
        this.response.setHeader('Content-Type','application/json');
        this.response.end(JSON.stringify(response));
    })
	
	.post(function(){
        var response;
        if(this.request.body.uuid === undefined ) {
            response = {
                "error" : true,
                "message" : "invalid data"
            };
        } else {
            /*Violations.insert({
                Uuid : this.request.body.uuid,
                KpiName : this.request.body.kpiName,
				ContractUuid : this.request.body.contractUuid,
				Datetime: this.request.body.datetime,
				ServiceName: this.request.body.serviceName,
				ActualValue: this.request.body.actualValue,
				ServiceScope: this.request.body.serviceScope,
				createdAt: new Date()
            });*/
            response = {
                "error" : false,
                "message" : "Violation added."
            }
        }
        this.response.setHeader('Content-Type','application/json');
        this.response.end(JSON.stringify(response));
 });

Router.onBeforeAction(function () {
  // all properties available in the route function
  // are also available here such as this.params

/*
  if (!Meteor.userId()) {
    this.render('login');
  } else {
    this.next();
  }
  */
 this.next();

});



/*
Router._filters = {
  resetScroll: function () {
    var scrollTo = window.currentScroll || 0;
    $('body').scrollTop(scrollTo);
    $('body').css("min-height", 0);
  }
};

var filters = Router._filters;

if(Meteor.isClient) {
  Router.onAfterAction(filters.resetScroll); // for all pages
}
*/


