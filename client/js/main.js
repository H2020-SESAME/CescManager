

//var mydevid = "355673069168537";
//var mydevid = "666";

//Meteor.subscribe("lastposition", mydevid);


/*
  Template.hello.helpers({
    positiondata: function () {
      //console.log(Geodatafinal.find({}));
        return Geodatafinal.find({ deviceid: mydevid });
      
    }
  });
*/

Template.sidebar.helpers({
  currentRouteIs: function (route) {
      //console.log("prwto->" + route);
      //console.log ("deutero->" + Router.current().route.getName().split(".")[0]); 
      //console.log(Router.current().route.getName().split(".")[0] === route);
       return Router.current().route.getName().split(".")[0] === route;
    }
  });


Template.sidebar.events({
    'click #dashboard': function (e) {
        e.preventDefault();
        Router.go('/dashboard');
        document.location.reload(true);
    },
    'click #tenor': function (e) {
        e.preventDefault();
        Router.go('/tenor');
        document.location.reload(true);
    },
    'click #catalogns': function (e) {
        e.preventDefault();
        Router.go('/catalogns');
        document.location.reload(true);
    },
    'click #catalogvnf': function (e) {
        e.preventDefault();
        Router.go('/catalogvnf');
        document.location.reload(true);
    },
    'click #operationalns': function (e) {
        e.preventDefault();
        Router.go('/operationalns');
        document.location.reload(true);
    },
    'click #monitoringns': function (e) {
        e.preventDefault();
        Router.go('/monitoringns');
        document.location.reload(true);
    },
    'click #monitoringvnf': function (e) {
        e.preventDefault();
        Router.go('/monitoringvnf');
        document.location.reload(true);
    },
    'click #monitoringcompute': function (e) {
        e.preventDefault();
        Router.go('/monitoringcompute');
        document.location.reload(true);
    },
    'click #monitoringnetwork': function (e) {
        e.preventDefault();
        Router.go('/monitoringnetwork');
        document.location.reload(true);
    }
});



Template.navbar.events({
    'click #logout': function (e) {
        e.preventDefault();
        Meteor.logout();
        Router.go('/login');
    },
    'click #sidebarcollapsenow': function (e) {
        e.preventDefault();
        var body = $('body');
        if (body.hasClass("sidebar-collapse")){
          body.removeClass("sidebar-collapse");
          body.removeClass("sidebar-open");
          Session.set("sidebar", true);
        }else{
          body.addClass("sidebar-collapse");
          body.addClass("sidebar-open");
          Session.set("sidebar", false);
        }
        
    }
    
});


Template.navbar.helpers({
    loggedUser: function () {
      console.log(Meteor.user());
      return Meteor.user().emails[0].address;
  
    }

  });





  Template.basic.events({
    'click #imei1': function () {
        alert("yo");
    },
    'click #imei2': function () {
        alert("yo2");
    }

  });







Template.monitoringcompute.events({
    'click #satpop': function (e) {
        e.preventDefault();
        Session.set("monpop", "satpop");
       
        
    },
    'click #edgepop': function (e) {
        e.preventDefault();
        Session.set("monpop", "edgepop");
        
    }  
});


Template.monitoringcompute.helpers({
    resources: function () {
      if (Session.get("monpop") == "satpop"){
        return "Satellite PoP";
      }else if (Session.get("monpop") == "edgepop"){
        return "Edge PoP";
      }else{
        return "Total";
      }
  
    }

  });








var prevclick="";

Template.gridstack.rendered = function () {
 var gridstackOptions = {};


 /*
 Tracker.autorun(function () {
  var grid = $('.grid-stack').gridstack(gridstackOptions).data('gridstack');
  grid.remove_all();
  _.each(gridTiles, function (tile) {
   var widgetElement = $('<div><div class="grid-stack-item-content" /><div/>')
   if(widgetElement)    {
    grid.add_widget(widgetElement, tile.x, tile.y, tile.width, tile.height);
    widgetElement.attr('data-custom-id', tile._id);
   }
  });
 }); // End autorun
  */





  var options = {
        cell_height: 80,
        vertical_margin: 10,
        float: true,
        acceptWidgets: '.grid-stack-item',
        removable: true,
        removeTimeout: 100
    };
    $('.grid-stack').gridstack(options);

   $('.supersidebar .grid-stack-item').draggable({
                revert: 'invalid',
                handle: '.grid-stack-item-content',
                scroll: false,
                appendTo: 'body'
            });




  
            $('.grid-stack').on('dragstart', function(event, ui) {
          console.log("DRAG START");
      });

      

      $('.grid-stack').on('dragstop', function(event, ui) {
          console.log("DRAG STOP");
      });

      $('.grid-stack').on('click', function(event, ui) {


          console.log("CLICKME");
          if (event.target.id=="nssource"){
            //$('#myModal2').modal('show');
          }else if(event.target.id=="nsdestination"){
            //$('#myModal3').modal('show');
          }else if (event.target.id=="vTU"){
            //$('#myModal').modal('show');
          }


          if (prevclick !="" && prevclick !="mysvg" && event.target.id != "mysvg" && prevclick !="nscanvas" && event.target.id != "nscanvas" && prevclick!=event.target.id){
            alert("line from-> "+prevclick+ " to-> "+event.target.id);
            var div1 = document.getElementById(prevclick);
             var div2 = document.getElementById(event.target.id)
            var off1 = getOffset(div1);
    var off2 = getOffset(div2);
    // center div1
    var x1 = off1.left + (off1.width/2)-600;
    var y1 = off1.top + (off1.height/2)-175;
    // center div2
    var x2 = off2.left + (off2.width/2)-688;
    var y2 = off2.top + (off2.height/2)-175;
    // distance
    //horizontal distance
    var hd = Math.abs(x2-x1);
    //vertical distance
    var vd = Math.abs(y2-y1);

    var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
    

              //var myarrow = '<svg width="'+hd+'" height="'+vd+'"><defs><marker id="arrow" markerWidth="13" markerHeight="13" refx="2" refy="6" orient="auto"><path d="M2,2 L2,11 L10,6 L2,2" style="fill:black;" /></marker></defs><path d="M100,150 L100,50" style="stroke:black; stroke-width: 1.25px; fill: none;marker-end: url(#arrow);"/></svg>';
              var myarrow = '<defs><marker id="arrow" markerWidth="13" markerHeight="13" refx="2" refy="6" orient="auto"><path d="M2,2 L2,11 L10,6 L2,2" style="fill:black;" /></marker></defs><path d="M'+x1+','+y1+' L'+x2+','+y2+'" style="stroke:black; stroke-width: 1.25px; fill: none;marker-end: url(#arrow);"/>';
        alert(myarrow);
      document.getElementById('mysvg').innerHTML += myarrow; 


          prevclick="";
          }else{
            prevclick=event.target.id;
          }
          
          console.log(prevclick);
          
      });
      

 // Define onchange to update Mongo collection
 $('.grid-stack').on('change', function (event, items) {
  _.each(items, function (item) {
    console.log("CHANGEEEEEE");
  });
 });
};      




Template.catalogns.events({
    'click #add-new-widget': function (e) {
        e.preventDefault();


        console.log("TEST2");
    },
    'click .addnewwidget': function (e) {
        e.preventDefault();

        console.log(e.target.innerHTML);
        var mygrid = $('.grid-stack').data('gridstack');
        //console.log(mygrid);
        var node = {x: 0, y: 0, width: 2, height: 1};
        mygrid.add_widget($('<div class="grid-stack-item" data-gs-no-resize="true" data-gs-locked="true" id="'+e.target.innerHTML+'"><div class="grid-stack-item-content nsgriditem" id="'+e.target.innerHTML+'">'+e.target.innerHTML+'</div></div>'),node.x, node.y, node.width, node.height);
        
        console.log("TEST");
    }
});




function connect(div1, div2, color, thickness) {
    var off1 = getOffset(div1);
    var off2 = getOffset(div2);
    // bottom right
    var x1 = off1.left + (off1.width/2);
    var y1 = off1.top + (off1.height/2);
    // top right
    var x2 = off2.left + (off2.width/2);
    var y2 = off2.top + (off2.height/2);
    // distance
    var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
    // center
    var cx = ((x1 + x2) / 2) - (length / 2);
    var cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
    // make hr
    var htmlLine = "<div style='z-index:15;padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
    //
    //alert(htmlLine);
    document.getElementById('nscanvas').innerHTML += htmlLine; 
}

function getOffset( el ) {
    var rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset,
        width: rect.width || el.offsetWidth,
        height: rect.height || el.offsetHeight
    };
}
