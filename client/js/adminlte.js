
Template.dashboard.onRendered(function () {

    var self = this;
    if (self.view.isRendered) {

        
        var body = $('body');
            body.removeClass();
            if (Session.get("sidebar")==false){
              body.addClass("skin-blue-light sidebar-mini sidebar-collapse sidebar-open");
            }else{
              body.addClass("skin-blue-light sidebar-mini");
            }

        $(function () {
            MeteorAdminLTE.run()
        });
      
    }
});
Template.dashboard.onDestroyed(function () {
  // deregister from some central store
  var body = $('body');
  if (body.hasClass("sidebar-open")){
    Session.set("sidebar", false);
  }else{
    Session.set("sidebar", true);
  }
});




Template.tenor.onRendered(function () {

    var self = this;
    if (self.view.isRendered) {

        
        var body = $('body');
            body.removeClass();
            if (Session.get("sidebar")==false){
              body.addClass("skin-blue-light sidebar-mini sidebar-collapse sidebar-open");
            }else{
              body.addClass("skin-blue-light sidebar-mini");
            }

        $(function () {
            MeteorAdminLTE.run()
        });
      
    }
});
Template.tenor.onDestroyed(function () {
  // deregister from some central store
  var body = $('body');
  if (body.hasClass("sidebar-open")){
    Session.set("sidebar", false);
  }else{
    Session.set("sidebar", true);
  }
});


Template.qos.onRendered(function () {

    var self = this;
    if (self.view.isRendered) {

        
        var body = $('body');
            body.removeClass();
            if (Session.get("sidebar")==false){
              body.addClass("skin-blue-light sidebar-mini sidebar-collapse sidebar-open");
            }else{
              body.addClass("skin-blue-light sidebar-mini");
            }

        $(function () {
            MeteorAdminLTE.run()
        });
      
    }
});
Template.qos.onDestroyed(function () {
  // deregister from some central store
  var body = $('body');
  if (body.hasClass("sidebar-open")){
    Session.set("sidebar", false);
  }else{
    Session.set("sidebar", true);
  }
});



Template.catalogns.onRendered(function () {

    var self = this;
    if (self.view.isRendered) {

        var body = $('body');
            body.removeClass();
            if (Session.get("sidebar")==false){
              body.addClass("skin-blue-light sidebar-mini sidebar-collapse sidebar-open");
            }else{
              body.addClass("skin-blue-light sidebar-mini");
            }

        $(function () {
            MeteorAdminLTE.run()
        });
      
    }
});
Template.catalogns.onDestroyed(function () {
  // deregister from some central store
  var body = $('body');
  if (body.hasClass("sidebar-open")){
    Session.set("sidebar", false);
  }else{
    Session.set("sidebar", true);
  }
});





Template.catalogvnf.onRendered(function () {

    var self = this;
    if (self.view.isRendered) {

        
        var body = $('body');
            body.removeClass();
            if (Session.get("sidebar")==false){
              body.addClass("skin-blue-light sidebar-mini sidebar-collapse sidebar-open");
            }else{
              body.addClass("skin-blue-light sidebar-mini");
            }

        $(function () {
            MeteorAdminLTE.run()
        });
      
    }
});
Template.catalogvnf.onDestroyed(function () {
  // deregister from some central store
  var body = $('body');
  if (body.hasClass("sidebar-open")){
    Session.set("sidebar", false);
  }else{
    Session.set("sidebar", true);
  }
});





Template.operationalns.onRendered(function () {

    var self = this;
    if (self.view.isRendered) {

        
        var body = $('body');
            body.removeClass();
            if (Session.get("sidebar")==false){
              body.addClass("skin-blue-light sidebar-mini sidebar-collapse sidebar-open");
            }else{
              body.addClass("skin-blue-light sidebar-mini");
            }

        $(function () {
            MeteorAdminLTE.run()
        });
      
    }
});
Template.operationalns.onDestroyed(function () {
  // deregister from some central store
  var body = $('body');
  if (body.hasClass("sidebar-open")){
    Session.set("sidebar", false);
  }else{
    Session.set("sidebar", true);
  }
});






Template.monitoringns.onRendered(function () {

    var self = this;
    if (self.view.isRendered) {

        
        var body = $('body');
            body.removeClass();
            if (Session.get("sidebar")==false){
              body.addClass("skin-blue-light sidebar-mini sidebar-collapse sidebar-open");
            }else{
              body.addClass("skin-blue-light sidebar-mini");
            }

        $(function () {
            MeteorAdminLTE.run()
        });
      
    }
});
Template.monitoringns.onDestroyed(function () {
  // deregister from some central store
  var body = $('body');
  if (body.hasClass("sidebar-open")){
    Session.set("sidebar", false);
  }else{
    Session.set("sidebar", true);
  }
});





Template.monitoringvnf.onRendered(function () {

    var self = this;
    if (self.view.isRendered) {

        
        var body = $('body');
            body.removeClass();
            if (Session.get("sidebar")==false){
              body.addClass("skin-blue-light sidebar-mini sidebar-collapse sidebar-open");
            }else{
              body.addClass("skin-blue-light sidebar-mini");
            }

        $(function () {
            MeteorAdminLTE.run()
        });
      
    }
});
Template.monitoringvnf.onDestroyed(function () {
  // deregister from some central store
  var body = $('body');
  if (body.hasClass("sidebar-open")){
    Session.set("sidebar", false);
  }else{
    Session.set("sidebar", true);
  }
});







Template.monitoringcompute.onRendered(function () {

    var self = this;
    if (self.view.isRendered) {

        
        var body = $('body');
            body.removeClass();
            if (Session.get("sidebar")==false){
              body.addClass("skin-blue-light sidebar-mini sidebar-collapse sidebar-open");
            }else{
              body.addClass("skin-blue-light sidebar-mini");
            }

        $(function () {
            MeteorAdminLTE.run()
        });
      
    }
});
Template.monitoringcompute.onDestroyed(function () {
  // deregister from some central store
  var body = $('body');
  if (body.hasClass("sidebar-open")){
    Session.set("sidebar", false);
  }else{
    Session.set("sidebar", true);
  }
});



Template.monitoringnetwork.onRendered(function () {

    var self = this;
    if (self.view.isRendered) {

        
        var body = $('body');
            body.removeClass();
            if (Session.get("sidebar")==false){
              body.addClass("skin-blue-light sidebar-mini sidebar-collapse sidebar-open");
            }else{
              body.addClass("skin-blue-light sidebar-mini");
            }

        $(function () {
            MeteorAdminLTE.run()
        });
      
    }
});
Template.monitoringnetwork.onDestroyed(function () {
  // deregister from some central store
  var body = $('body');
  if (body.hasClass("sidebar-open")){
    Session.set("sidebar", false);
  }else{
    Session.set("sidebar", true);
  }
});

