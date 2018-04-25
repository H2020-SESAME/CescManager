

Template.qos.events({
	
	'click #btnapply1': function (event, template) {
        event.preventDefault();

        var op1down = template.find('#op1down').value;
        var op1up = template.find('#op1up').value;


		
			Meteor.call('mysoapset','ROOT#0;CESCS#0;CESC#0;HENB_GW_CONNECTION#0;HENB_GW#0','5714',op1down/1000);
			callnos();
			Meteor.call('mysoapset','ROOT#0;CESCS#0;CESC#0;HENB_GW_CONNECTION#0;HENB_GW#0','5719',op1up/1000);
			callnos();
			Meteor.call('qos', 'op1', op1down, op1up, function(error, results) {
				 //results.data should be a JSON object
				//alert(results);
				console.log(results);
				result = results;
			});
			
        	alert("QoS Rules Applied for Operator1!");

    },
	
	'click #btnapply2': function (event, template) {
        event.preventDefault();

        var op2down = template.find('#op2down').value;
        var op2up = template.find('#op2up').value;


		
			Meteor.call('mysoapset','ROOT#0;CESCS#0;CESC#0;HENB_GW_CONNECTION#1;HENB_GW#0','5714',op2down/1000);
			callnos();
			Meteor.call('mysoapset','ROOT#0;CESCS#0;CESC#0;HENB_GW_CONNECTION#1;HENB_GW#0','5719',op2up/1000);
			callnos();
			Meteor.call('qos', 'op2', op2down, op2up, function(error, results) {
				 //results.data should be a JSON object
				//alert(results);
				console.log(results);
				result = results;
			});
			
        	alert("QoS Rules Applied for Operator2!");

    },
	
    'submit #formqos': function (event) {
        event.preventDefault();

        var op1down = event.target.op1down.value;
        var op1up = event.target.op1up.value;


			Meteor.call('qos', 'op1', op1down, op1up, function(error, results) {
				 //results.data should be a JSON object
				//alert(results);
				console.log(results);
				result = results;
			});

        	alert("QoS Rules Applied for Operator1!");

    },
    'click .toggle-soap'()
    {

      callnos();


    },
	'click .toggle-soapd'()
		{
		  Meteor.call('mydelete');
		},


    'submit .setvnf1maxdl'(event) {
        event.preventDefault();
        const text = event.target.text.value;
      //console.log("before");
      Meteor.call('mysoapset','ROOT#0;CESCS#0;CESC#0;HENB_GW_CONNECTION#0;HENB_GW#0','5714',text);
      callnos();
      //console.log("after");
      event.target.text.value = '';

    },
    'submit .setvnf1maxul'(event) {
        event.preventDefault();
        const text = event.target.text.value;
    Meteor.call('mysoapset','ROOT#0;CESCS#0;CESC#0;HENB_GW_CONNECTION#0;HENB_GW#0','5719',text);
    callnos();
   event.target.text.value = '';
    },
    'submit .setvnf1maxue'(event) {
        event.preventDefault();
        const text = event.target.text.value;
    Meteor.call('mysoapset','ROOT#0;CESCS#0;CESC#0;HENB_GW_CONNECTION#0;HENB_GW#0','5713',text);
    callnos();
  event.target.text.value = '';
    },
    'submit .setvnf2maxdl'(event) {
        event.preventDefault();
        const text = event.target.text.value;
    Meteor.call('mysoapset','ROOT#0;CESCS#0;CESC#0;HENB_GW_CONNECTION#1;HENB_GW#0','5714',text);
    callnos();
  event.target.text.value = '';
    },
    'submit .setvnf2maxul'(event) {
        event.preventDefault();
        const text = event.target.text.value;
    Meteor.call('mysoapset','ROOT#0;CESCS#0;CESC#0;HENB_GW_CONNECTION#1;HENB_GW#0','5719',text);
    callnos();
  event.target.text.value = '';
    },
    'submit .setvnf2maxue'(event) {
        event.preventDefault();
        const text = event.target.text.value;
    Meteor.call('mysoapset','ROOT#0;CESCS#0;CESC#0;HENB_GW_CONNECTION#1;HENB_GW#0','5713',text);
    callnos();
  event.target.text.value = '';
},
});


/////////////////////////////////////////////////////////////////////////andreas


//import { Markers } from '../api/maps.js';
//import './map.html';
//export const Markers = new Mongo.Collection('markers');
//export const Markers = new Mongo.Collection('markers');
//export const Logs = new Mongo.Collection('logs');
//export const Vnfs = new Mongo.Collection('vnfs');

var attributes = [
  ["ROOT#0;CESCS#0;CESC#0;SC_C_VNF_CONNECTION#201","CVNF","1475"],
  ["ROOT#0;CESCS#0;CESC#0;HENB_GW_CONNECTION#0","VNF1","1475","5623","5572","5714","5719","5713"],
  ["ROOT#0;CESCS#0;CESC#0;HENB_GW_CONNECTION#1","VNF2","1475","5623","5572","5714","5719","5713"],
  ["ROOT#0;CESCS#0;CESC#0;LTE_FAP_INFO#1;AP_TR069#0", "PNF","21505","22513","22514","21618","22512","21506","21507","21509","21502","21492","22024","22025"]

];

//var markers = {};

Template.qos.onCreated(function() {

  Logs.find({}).observe({
  changed: function () {
    callnos();
  }
});

GoogleMaps.ready('map', function(map) {
  /*  google.maps.event.addListener(map.instance, 'click', function(event) {
       Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng(),plmn: Markers.find({}).count()+1});
        console.log("point 1");
 console.log(Markers.find({}).count());
});*/
    var markers = {};
    var icons = [
    {
      url: 'https://image.ibb.co/d95sFw/ant_green.png',
      scaledSize: new google.maps.Size(50, 50),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(20,20),
      labelOrigin: new google.maps.Point(65,33)
    },
     {
      url: 'https://image.ibb.co/cJ5g8G/ant_red.png',
      scaledSize: new google.maps.Size(50, 50),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(20,20),
      labelOrigin: new google.maps.Point(65,33)
    }];



     Markers.find({}).observe({

         added: function (document) {
         var marker = new google.maps.Marker({
           //draggable: true,
           animation: google.maps.Animation.DROP,
           position: new google.maps.LatLng(document.lat, document.lng),
           map: map.instance,
           icon:  icons[document.status == "ENABLED"?0:1] ,
           id: document._id,
          // title: document.plmn,
           /*label:{
             text:"PLMN: "+document.plmn,
             color: "#E9F7EF",
             fontSize: "12px",
             fontWeight: "normal"
           }*/
         });
         var infowindow2 = new google.maps.InfoWindow({
           content: "<h3 class='marker'>Status:</h3>"+document.status+
           "<br><h3 class='marker'>PLMNs:</h3>"+document.plmn+
           "<br><h3 class='marker'>EARFCNDL:</h3>"+document.earfcndl+
           "<br><h3 class='marker'>EARFCNUL:</h3>"+document.earfcnul+
           "<br><h3 class='marker'>MOCN:</h3>"+document.mocn+
           "<br><h3 class='marker'>DL Bandwidth:</h3>"+document.dlbw+"MHz"+
           "<br><h3 class='marker'>UL Bandwidth:</h3>"+document.ulbw+"MHz"+
           "<br><h3 class='marker'>Physical Cell ID:</h3>"+document.pci+
           "<br><h3 class='marker'>Cell ID:</h3>"+document.ci+
           "<br><h3 class='marker'>TAC:</h3>"+document.tac,
           maxWidth: 500
         });
         marker.addListener('click', function() {
         infowindow2.open(map.instance, marker);
         });
         //var markers = {};
         //markers[document._id] = marker;

           google.maps.event.addListener(marker, 'dragend', function(event) {
           console.log("point 3");
           Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng()}});
         });

         markers[document._id] = marker;
       },
       changed: function (newDocument, oldDocument) {
         markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
       },
       removed: function (oldDocument) {
         markers[oldDocument._id].setMap(null);
         google.maps.event.clearInstanceListeners(markers[oldDocument._id]);
         delete markers[oldDocument._id];
       }
     });
   });

 });




    Meteor.startup(function() {
      GoogleMaps.load({key: 'AIzaSyBv2Bcy9S_zxqiFk6ybMANasZvzMDZlobk'});
    });




    Template.qos.helpers({
      mapOptions: function() {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(37.99640893936157,23.81810188293457),
          zoom: 17,
          //mapTypeId: 'satellite',

        };
      }
    },
    pnfstatus(){

      const  item = Markers.find({}).fetch();
      if(item[0]){
      return item[0].status;
    }
    },
    pnfplmns(){

      const  item = Markers.find({}).fetch();
      if(item[0]){
      return item[0].plmn;
    }
    },
    pnfband(){

      const  item = Markers.find({}).fetch();
    if(item[0]){
      return item[0].band;
    }
    },
    pnfearfcndl(){

      const  item = Markers.find({}).fetch();
      if(item[0]){
      return item[0].earfcndl;
    }
    },
    pnfearfcnul(){

      const  item = Markers.find({}).fetch();
      if(item[0]){
      return item[0].earfcnul;
    }
    },
    pnfmocn(){

      const  item = Markers.find({}).fetch();
      if(item[0]){
      if(item[0].mocn == "MOCN"){
        return "ENABLED";
      }
       else{return "DISABLED";}
     }
    },
    pnfdlbw(){

      const  item = Markers.find({}).fetch();
      if(item[0]){
      return item[0].dlbw + " MHz";
    }
    },
    pnfulbw(){

      const  item = Markers.find({}).fetch();
      if(item[0]){
      return item[0].ulbw + " MHz";
    }
    },
    pnfpci(){

      const  item = Markers.find({}).fetch();
      if(item[0]){
      return item[0].pci;
    }
    },
    pnfci(){

      const  item = Markers.find({}).fetch();
      if(item[0]){
      return item[0].ci;
    }
    },
    pnftac(){

      const  item = Markers.find({}).fetch();
      if(item[0]){
      return item[0].tac;
    }
    },
    cvnfstatus(){

      const  item = Vnfs.find({name:"CVNF"}).fetch();
      if(item[0]){
      return item[0].status;
    }
    },
    vnf1status(){

      const  item = Vnfs.find({name:"VNF1"}).fetch();
      if(item[0]){
      return item[0].status;
    }
    },
    vnf1plmn(){

      const  item = Vnfs.find({name:"VNF1"}).fetch();
      if(item[0]){
      return item[0].plmn;
    }
    },
    vnf1epcip(){
      const  item = Vnfs.find({name:"VNF1"}).fetch();
      if(item[0]){
      return item[0].epc_ip;
    }
    },
    vnf1maxdl(){

      const  item = Vnfs.find({name:"VNF1"}).fetch();
      if(item[0]){
      return item[0].max_dl+ " MBps";
    }
    },
    vnf1maxul(){
      const  item = Vnfs.find({name:"VNF1"}).fetch();
      if(item[0]){
      return item[0].max_ul+ " MBps";
    }
    },

    vnf1maxue(){

      const  item = Vnfs.find({name:"VNF1"}).fetch();
      if(item[0]){
      return item[0].max_ue;
    }
    },
    vnf2status(){
    const  item = Vnfs.find({name:"VNF2"}).fetch();
      if(item[0]){
      return item[0].status;
    }
    },
    vnf2plmn(){

      const  item = Vnfs.find({name:"VNF2"}).fetch();
      if(item[0]){
      return item[0].plmn;
    }
    },
    vnf2epcip(){

      const  item = Vnfs.find({name:"VNF2"}).fetch();
      if(item[0]){
      return item[0].epc_ip;
    }
    },
    vnf2maxdl(){

      const  item = Vnfs.find({name:"VNF2"}).fetch();
      if(item[0]){
      return item[0].max_dl + " MBps";
    }
    },
    vnf2maxul(){

      const  item = Vnfs.find({name:"VNF2"}).fetch();
      if(item[0]){
      return item[0].max_ul + " MBps";
    }
    },

    vnf2maxue(){

      const  item = Vnfs.find({name:"VNF2"}).fetch();
      if(item[0]){
      return item[0].max_ue;
    }
    },


    });







function callnos() {
var data;

Meteor.call('mydelete');
Meteor.call('vnfsmanage',"REM");
for (var  i = 0; i < attributes.length; i++) {
  var inattr = attributes[i];
  Meteor.call('mysoapCall',inattr[0],inattr[1]);

}


  console.log(Logs.find().count());

  if(Logs.find().count()>0){

  console.log("mphka");
  for (var  i = 0; i < attributes.length; i++) {
        var inattributes = attributes[i];
        var vnf1_status;
        var vnf2_status;

      //  Meteor.call('mysoapCall',inattributes[0],inattributes[1]);
        const  items = Logs.find({name:inattributes[1]}).fetch();

          //data = findsoap(items[0],inattributes[j]);
          //console.log(data);
          switch (inattributes[1]){
          case "CVNF":
                Meteor.call('vnfsmanage',
               "CVNF",
               findsoap(items[0],inattributes[2]));
               break;
          case "VNF1":
               vnf1_status = findsoap(items[0],inattributes[2]) == "ENABLED" ? 1:0;
                Meteor.call('vnfsmanage',
                "VNF1",                                 //name
               findsoap(items[0],inattributes[2]),      //status
               quoter(findsoap(items[0],inattributes[3])),      //plmn
               quoter(findsoap(items[0],inattributes[4])),      //epc_ip
               findsoap(items[0],inattributes[5]),      //max_dl
               findsoap(items[0],inattributes[6]),      //max_ul
               findsoap(items[0],inattributes[7]));     //max_ue
               break;
          case "VNF2":
               vnf2_status = findsoap(items[0],inattributes[2]) == "ENABLED" ? 1:0;
               Meteor.call('vnfsmanage',
               "VNF2",
               findsoap(items[0],inattributes[2]),
               quoter(findsoap(items[0],inattributes[3])),
               quoter(findsoap(items[0],inattributes[4])),
               findsoap(items[0],inattributes[5]),
               findsoap(items[0],inattributes[6]),
               findsoap(items[0],inattributes[7]));
               break;
          case "PNF":
               Meteor.call('markersmanage',
               findsoap(items[0],inattributes[12]),                  //lat
               findsoap(items[0],inattributes[13]),                  //lng
               vnf1_status || vnf2_status ? "ENABLED":"DISABLED",    //status
               findsoap(items[0],inattributes[2]),                   //band
               findsoap(items[0],inattributes[3]),                   //earfcndl
               findsoap(items[0],inattributes[4]),                   //earfcnul
               quoter(findsoap(items[0],inattributes[5])),           //plmn
               quoter(findsoap(items[0],inattributes[6])),           //mocn
               findsoap(items[0],inattributes[7]),                   //dlbw
               findsoap(items[0],inattributes[8]),                   //ulbw
               quoter(findsoap(items[0],inattributes[9])),           //pci
               findsoap(items[0],inattributes[10]),                  //ci
               findsoap(items[0],inattributes[11]));                 //tac
               break;

        }
     }
}
  }



function findsoap(xmlstring,xmlattribute){
  var searchstring = '="'+xmlattribute+'">';
  //find the start of the pattern
  var start_pat = xmlstring.res.search(searchstring);
  //find the start of the attribute
  var start_at = start_pat+searchstring.length;
  if (start_at >= searchstring.length)
    {
      var i=0;
      while (xmlstring.res.charAt(start_at+i) != '<')
        {
        i++;
        }
      var end_at = start_at+i;
      return xmlstring.res.substring(start_at, end_at);
    }
  else
    {
      return xmlstring.name +"."+xmlattribute+ ": VARIABLE NOT FOUND";
    }
}

function quoter(inputstr){
  var i=0;
  var j=0;
  var endstr = inputstr.length;
  var output = "";
  var temp =inputstr.substring(0,endstr);;
  while (i != -1)
  {
    //console.log("i="+i);
    temp = temp.substring(i,temp.length);
    i = temp.search("&quot;");
    if( i != -1)
    {
      temp = temp.substring(i+6,temp.length);
      ///console.log(temp);
      j = temp.search("&quot;");
      output = output + temp.substring(0,j) + ", ";
      i=j+6;
    }
  }
  return output.substring(0,output.length-2);
}
