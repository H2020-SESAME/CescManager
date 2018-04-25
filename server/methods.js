var dgram = Npm.require('dgram');
//export const Markers = new Mongo.Collection('markers');
//export const Logs = new Mongo.Collection('logs');
//export const Vnfs = new Mongo.Collection('vnfs');



Meteor.publishComposite('recentViolations', {
    find: function() {
        var now = Date.now() - 3 * 60 * 1000;
        return Violations.find({"createdAt" : { $gte : now }});
		//return Violations.find();
    },
    children: [// networkservices
        {
			collectionName: "NSviolations",
			
            find: function(viol) {
                return NetworkServices.find({slaname: viol.contractUuid})
            }
        }
    ]
});

Violations.allow({
insert: function () {
    return true;
},

remove: function (){
    return true;
},

update: function() {
    return true;
}

});

Violations.before.insert (function (userId, doc) {
  var d = Date.now();
  doc.createdAt = d;
  
  
  
});

Meteor.methods({
  addUser: function (firstName, lastName, email) {
    Userdata.insert({
      firstName: firstName,
      lastName: lastName,
      createdAt: new Date(),
      userid: Meteor.userId(),
      email: email
    });
  },
  addNode: function (nsname, description, operator, slaname, nodes, links) {
    NetworkServices.insert({
      nsname: nsname,
      description: description,
	  operator: operator,
	  slaname: slaname,
      nodes: nodes,
      links: links,
      createdAt: new Date()
    });
  },
  addDeployed: function (nsid, nsname, operator, nsconf, tenornsid, vnfid) {
    return DeployedNetworkServices.insert({
      nsid: nsid,
      nsname: nsname,
	  operator: operator,
      nsconf: nsconf,
	  tenornsid: tenornsid,
	  vnfid: vnfid,
      started: 2,
      createdAt: new Date()
    });
  },
  updateDeployedTenorid: function(nsid, tenornsid){
	  return DeployedNetworkServices.update({_id : nsid},{$set:{tenornsid : tenornsid}});
  },
  updateDeployedVNFid: function(nsid, vnfid, public_ip){
	  return DeployedNetworkServices.update({_id : nsid},{$set:{vnfid : vnfid, public_ip : public_ip}});
  },
  addSLA: function (slaid, slaname) {
    return SLAs.insert({
      slaid: slaid,
      slaname: slaname,
      started: 2,
      createdAt: new Date()
    });
  },
  deployedState: function (dnsid, state) {
      DeployedNetworkServices.update({ _id: dnsid }, { $set: {started: state} });
  },
  getTenoridDNS: function (dnsid){
	  return DeployedNetworkServices.findOne({ _id: dnsid}).tenornsid;
  },
  getTenoridVNF: function (dnsid){
	  return DeployedNetworkServices.findOne({ _id: dnsid}).vnfid;
  },
  getOperatorNS: function (cnsid){
	  var operator = NetworkServices.findOne({ _id: cnsid}).operator;
	  console.log("operator "+operator);
	  return operator;
  },
  removeDeployed: function (dnsid) {
      DeployedNetworkServices.remove(dnsid);
  },
  removeCatalogueNS: function (nsid) {
	  NetworkServices.remove(nsid);
  },


  qos: function(operator, opdown, opup) {

	  var updateData = {
	   data: {
	   },
	   headers: {
        'Content-Type': 'text/plain'
      }
	}

	 if(operator == 'op1'){
		HTTP.post( 'http://10.30.0.213:8080/qos?opdown='+opdown+'&opup='+opup, updateData,
	   function( error, response ) {

	   if ( error ) {
		  console.log( error );
	   } else {
		  console.log( response );
	   }

	});
	 }
	 else{
	  HTTP.post( 'http://10.30.0.235:8080/qos?opdown='+opdown+'&opup='+opup, updateData,
	   function( error, response ) {

	   if ( error ) {
		  console.log( error );
	   } else {
		  console.log( response );
	   }

	});
	}
  },


  atosCall: function(operator, sla, nsname){
	 output = HTTP.call("POST", "http://10.100.96.10:8080/api/agreements", {
		 headers: {
        'Content-Type': 'application/xml'
    },
	content:
			'<wsag:Agreement xmlns:sla="http://sla.atos.eu" xmlns:wsag="http://www.ggf.org/namespaces/ws-agreement" wsag:AgreementId="agreement-'+nsname+operator+'">' +
				'<wsag:Name>agreement-'+nsname+operator+'</wsag:Name>'+
				'<wsag:Context>'+
					'<wsag:AgreementInitiator>sesame5G</wsag:AgreementInitiator>'+
					'<wsag:AgreementResponder>'+operator+'</wsag:AgreementResponder>'+
					'<wsag:ServiceProvider>AgreementResponder</wsag:ServiceProvider>'+
					'<wsag:ExpirationTime>2018-08-07T14:00:00+02:00</wsag:ExpirationTime>'+
					'<wsag:TemplateId>template-vWatermark</wsag:TemplateId>'+
					'<sla:Service>SeSAME_September</sla:Service>'+
				'</wsag:Context>'+
				'<wsag:Terms>'+
					'<wsag:All>'+
						'<wsag:ServiceProperties wsag:Name="ServiceProperties" wsag:ServiceName="SeSAME_September">'+
							'<wsag:VariableSet>'+
								'<wsag:Variable wsag:Name="Availability" wsag:Metric="xs:double">'+
									'<wsag:Location>SeSAME_September/Availability</wsag:Location>'+
								'</wsag:Variable>'+
							'</wsag:VariableSet>'+
						'</wsag:ServiceProperties>'+
						'<wsag:GuaranteeTerm wsag:Name="GT_ResponseTime">'+
							'<wsag:ServiceScope wsag:ServiceName="SeSAME_September">'+
				  '</wsag:ServiceScope>'+
							'<wsag:ServiceLevelObjective>'+
								'<wsag:KPITarget>'+
									'<wsag:KPIName>Availability</wsag:KPIName>'+
									'<wsag:CustomServiceLevel>'+
										'<sla:Slo>'+
											'<sla:Constraint>Availability GT 0.97</sla:Constraint>'+
											'<sla:Description>'+
						  '</sla:Description>'+
										'</sla:Slo>'+
									'</wsag:CustomServiceLevel>'+
								'</wsag:KPITarget>'+
							'</wsag:ServiceLevelObjective>'+
						'</wsag:GuaranteeTerm>'+
					'</wsag:All>'+
				'</wsag:Terms>'+
			'</wsag:Agreement>'
	 }, function (err, result) {
		if (err) {
			console.log('error occurred..');
			console.log(err);
			return;
		}
		console.log(result);
		console.log('----------------------');
	});
  },




  tenorCallRun: function (dnsid) {
		  var updateData = {
	   data: {
		  "ns_id": "1967",
		  "callbackUrl": "https://httpbin.org/post",
		  "flavour": "m1.medium"
	   },
	   headers: {
        'Content-Type': 'application/json'
      }
	}

	HTTP.post( 'http://localhost:4000/vnf-provisioning/vnf-instances/'+vnfid+'/', updateData,
	   function( error, response ) {

	   if ( error ) {
		  console.log( error );
	   } else {
		  console.log( response );
	   }

	});
  },

  tenorCallAdd: function (dnsid, operator) {

		var nsid;

		var tenor_ns_id;

		if(operator == "operator-1")
		{
			tenor_ns_id = "alksdjlaksjd1241456";
		}
		else{
			tenor_ns_id = "alksdjlaksjd1241234";
		}



		var updateData = {
	   data: {
		  "vnfds":["1996"],
		  "ns_id": tenor_ns_id,
		  "callbackUrl": "https://httpbin.org/post",
		  "flavour":"Basic",
		  "prometheus_url":"http://10.100.96.10:5000",
		  "pop_id":1,
		  "select_pop_vnfs":"0"
	   },
	   headers: {
        'Content-Type': 'application/json'
      }
	}

	HTTP.post( 'http://localhost:4000/ns-instances', updateData,
	   function( error, response ) {

	   if ( error ) {
		  console.log( error );
	   } else {
		  console.log( response );
		  var jsonresp = JSON.parse(response.content);
		  nsid = jsonresp.id;
		  console.log("NS ID "+nsid );
		  Meteor.call("updateDeployedTenorid", dnsid, nsid);
	   }

	});

	var vnfid, public_ip;


	var tries = 0;
	var reqstatus;
	Meteor._sleepForMs(40000);
	//while(vnfid == undefined && tries < 100 && reqstatus!='404')
	//{
		Meteor._sleepForMs(2000);
		HTTP.get('http://localhost:4000/ns-instances/'+nsid,
		function( error, response ) {

	   if ( error ) {
		  console.log( error );
		  reqstatus = 404;
	   } else {
		  console.log( response );
		  var reqstatus = response.statusCode;
		  var jsonresp = JSON.parse(response.content);
		  vnfid = jsonresp.vnfrs[0].vnfr_id;
		  console.log("VNF ID "+vnfid);
		  Meteor.call("updateDeployedVNFid", dnsid, vnfid, '0.0.0.0');
	   }

	});

	if(vnfid == null){
		Meteor._sleepForMs(20000);
		Meteor._sleepForMs(10000);
		HTTP.get('http://localhost:4000/ns-instances/'+nsid,
		function( error, response ) {

	   if ( error ) {
		  console.log( error );
		  reqstatus = 404;
	   } else {
		  console.log( response );
		  var reqstatus = response.statusCode;
		  var jsonresp = JSON.parse(response.content);
		  
		  vnfid = jsonresp.vnfrs[0].vnfr_id;
		  public_ip = jsonresp.vnfrs[0].vnf_addresses.controller;
		  console.log("VNF ID "+vnfid+" Public IP "+public_ip );
		  Meteor.call("updateDeployedVNFid", dnsid, vnfid, public_ip);
	   }

	});
	}
	
	output = HTTP.call("PUT", "http://10.100.96.10:8080/api/enforcements/agreement-watermarkoperator-1/start", {
		  headers: {
			  'Content-Type': 'text/plain'
		}
	  }, function (err, result) {
			if (err) {
				console.log('error occurred..');
				console.log(err);
				return;
			}
			console.log(result);
			console.log('----------------------');
		});
	//}



  },


  /*
  results = HTTP.call("GET", "http://10.100.96.10:8080/api/templates");
	  var list;
	  xml2js.parseString(results.content, function (jsError, jsResult) {
                    console.error('errors',jsError);
					var jsstr = JSON.stringify(jsResult);
					var jsonparse = JSON.parse(jsstr);

					var i = 0;
					var countslas = jsonparse['templates']['wsag:Template'][i];
					while (countslas != 'undefined'){

						console.log('iteration check ',countslas);
						//var servicename = jsonparse['templates']['wsag:Template'][i]['wsag:Terms'][0]['wsag:All'][0]['wsag:ServiceProperties'][0]['$']['wsag:ServiceName'];
                    console.log('xml to js \n',servicename);
					list = servicename;//JSON.parse(jsstr);

					Meteor.call('addSLA', '1', list, function(error, results) {
						console.log(results);
					});
					i++;
					}


                });
	  console.log(list);
	  return list;
	  */



  tenorCallDel: function (dnsid) {

	var tenornsid = Meteor.call("getTenoridDNS", dnsid);
	console.log("Tenor NS ID : "+tenornsid);
	var deleteData = {
	   data: {}
	}


	HTTP.del( 'http://localhost:4000/ns-instances/'+tenornsid, deleteData,
	   function( error, response ) {

	   if ( error ) {
		  console.log( error );
	   } else {
		  console.log( response );
	   }

	});


	output = HTTP.call("PUT", "http://10.100.96.10:8080/api/enforcements/agreement-watermarkoperator-1/stop", {
		  headers: {
			  'Content-Type': 'text/plain'
		}
	  }, function (err, result) {
			if (err) {
				console.log('error occurred..');
				console.log(err);
				return;
			}
			console.log(result);
			console.log('----------------------');
		});

  },


  tenorCallIP: function (dnsid) {

	var nsid = Meteor.call("getTenoridDNS", dnsid);
	console.log("Tenor NS ID : "+nsid);
	
	HTTP.get('http://localhost:4000/ns-instances/'+nsid,
		function( error, response ) {

	   if ( error ) {
		  console.log( error );
		  reqstatus = 404;
	   } else {
		  console.log( response );
		  var reqstatus = response.statusCode;
		  var jsonresp = JSON.parse(response.content);
		  
		  vnfid = jsonresp.vnfrs[0].vnfr_id;
		  public_ip = jsonresp.vnfrs[0].vnf_addresses.controller;
		  console.log("VNF ID "+vnfid+" Public IP "+public_ip );
		  Meteor.call("updateDeployedVNFid", dnsid, vnfid, public_ip);
	   }

	});

  },

  NSStart: function (dnsid, vnfid, operatorid, nstype) {

	  console.log("Operator "+operatorid+" nstype "+nstype+" VNF ID "+vnfid);
	  var reqdata;
	  if(operatorid == "operator-1")
		reqdata = { "Content-Type" : "application/octet-stream", "content" : "sudo /home/ubuntu/vdpi-op1.sh" };
	  else reqdata = { "Content-Type" : "application/octet-stream", "content" : "sudo /home/ubuntu/vdpi-op2.sh" };

	  HTTP.call('POST',  'http://10.100.96.10:4000/vnf-provisioning/vnf-instances/'+vnfid+'/execute', reqdata,
		function( error, response ) {

	   if ( error ) {
		  console.log( error );
	   } else {
		  console.log( response );
	   }

	});

	Meteor._sleepForMs(7000);
	var reqdata = { "Content-Type" : "application/octet-stream", "content" : "sudo killall ndpiReader" };

	HTTP.call('POST',  'http://10.100.96.10:4000/vnf-provisioning/vnf-instances/'+vnfid+'/execute', reqdata,
		function( error, response ) {

	   if ( error ) {
		  console.log( error );
	   } else {
		  console.log( response );
	   }

	});

	Meteor._sleepForMs(2000);

	var reqdata = { "Content-Type" : "application/octet-stream", "content" : "sudo killall ndpiReader" };

	HTTP.call('POST',  'http://10.100.96.10:4000/vnf-provisioning/vnf-instances/'+vnfid+'/execute', reqdata,
		function( error, response ) {

	   if ( error ) {
		  console.log( error );
	   } else {
		  console.log( response );
	   }

	});

	Meteor._sleepForMs(2000);

	console.log("Start proper nDPI");
	var reqdata;

	if(operatorid == "operator-1")
		reqdata = { "Content-Type" : "application/octet-stream", "content" : "sudo /home/ubuntu/vDPI/example/ndpiReader -i ens4 -f 'not host 172.21.5.81'" };
	else reqdata = { "Content-Type" : "application/octet-stream", "content" : "sudo /home/ubuntu/vDPI/example/ndpiReader -i ens4 -f 'not host 172.21.5.80'" };

	HTTP.call('POST',  'http://10.100.96.10:4000/vnf-provisioning/vnf-instances/'+vnfid+'/execute', reqdata,
		function( error, response ) {

	   if ( error ) {
		  console.log( error );
	   } else {
		  console.log( response );
	   }

	});
  },

  NSStop: function (dnsid, vnfid, operatorid, nstype) {

	  console.log("Operator "+operatorid+" nstype "+nstype+" VNF ID "+vnfid);

	  var reqdata = { "Content-Type" : "application/octet-stream", "content" : "sudo killall ndpiReader" };

	  HTTP.call('POST',  'http://10.100.96.10:4000/vnf-provisioning/vnf-instances/'+vnfid+'/execute', reqdata,
		function( error, response ) {

	   if ( error ) {
		  console.log( error );
	   } else {
		  console.log( response );
	   }

	});
  },

  sendUDP: function (string, where) {

            var PORT = 33333;

            console.log(where);

            if (where==1){
              var HOST = '10.143.0.209';
            }else if (where==2){
              var HOST = '10.100.16.11';
            }else if (where==3){
              var HOST = '10.30.0.100';
            }


            var message = new Buffer(string);

            var client = dgram.createSocket('udp4');


            client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
            if (err) throw err;
                console.log('UDP message sent to ' + HOST +':'+ PORT);
                client.close();
            });
  },


/////////////////////////////////////////////////////////////////////////andreas


mysoapCall: function(path,netf){
	 output = HTTP.call("POST", "http://10.30.0.96:8080/3gpp/BasicCMIRP?wsdl", {
		 headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Accept-Encoding':'gzip,deflate',
        'username':'soap_sesame_dash',
        'password':'ii70mseq',
        'Host': 'rhel084:8080'
    },
	content:
      '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '+
      'xmlns:bas="http://www.3gpp.org/ftp/specs/archive/32_series/32.606/BasicCMIRPData">' +
      '<soapenv:Header/>'+
      '<soapenv:Body>'+
      '<bas:getMOAttributes>'+
      '<invokeIdentifierIn>10</invokeIdentifierIn>'+
      '<queryXpathExp>//*[@DN="'+path+'"]//*[@RegisteredAs]</queryXpathExp>'+
      '</bas:getMOAttributes>'+
      '</soapenv:Body>'+
      '</soapenv:Envelope>'
	 }, function (err, result) {
		if (err) {
			console.log('error occurred..');
			console.log(err+"from mysoapcall");
			return;
		}
		//console.log(result.content);
		console.log('----------------------');
    //Logs.insert({ res: result.content, name: netf});
    var name = netf;
    console.log(name);
    if(Logs.find({name}).count()>0){
    const  item = Logs.find({name}).fetch();
    console.log(item[0]._id);
    Logs.update(item[0]._id, { $set: { res: result.content } });
    }
    else{
      Logs.insert({ res: result.content, name: netf});
    }

    });
},
mydelete:function(){
  Markers.remove({});
  //Logs.remove({});
  Vnfs.remove({});
},
markersmanage:function(noslat,noslng,status,band,earfcndl,earfcnul,plmn,mocn,dlbw,ulbw,pci,ci,tac){
  var storelat = parseInt(noslat)*90/(Math.pow(2,23));
  var storelng = parseInt(noslng)*360/(Math.pow(2,24));
  var storedlbw;
  //console.log("markers manage");
  switch (dlbw){
    case "[15]":
      storedlbw = "3";
      break;
    case "[25]":
      storedlbw = "5";
      break;
    case "[50]":
      storedlbw = "10";
      break;
    case "[100]":
      storedlbw = "20";
      break;
  }
  var storeulbw;
  switch (ulbw){
    case "[15]":
      storeulbw = "3";
      break;
    case "[25]":
      storeulbw = "5";
      break;
    case "[50]":
      storeulbw = "10";
      break;
    case "[100]":
      storeulbw = "20";
      break;
  }

  Markers.remove({});
  Markers.insert({ lat: storelat, lng: storelng ,plmn,status,band,earfcndl,earfcnul,plmn,mocn,dlbw:storedlbw,ulbw:storeulbw,pci,ci,tac});
},
vnfsmanage:function(name,status,plmn,epc_ip,max_dl,max_ul,max_ue){
//console.log("vnfs manage"+name);
  switch (name){
    case "CVNF":
    // console.log("case cvnf");
      Vnfs.insert({name,status});
      break;
    case "VNF1":
     //console.log("case vnf1");
      Vnfs.insert({ name,status,plmn,epc_ip,max_dl,max_ul,max_ue});
      break;
    case "VNF2":
      //console.log("case vnf2");
      Vnfs.insert({ name,status,plmn,epc_ip,max_dl,max_ul,max_ue});
      break;
    case "REM":
      //console.log("case remove");
      Vnfs.remove({});
      break;
  }

},
mysoapset:function(path,attr,value){
 output = HTTP.call("POST", "http://10.30.0.96:8080/3gpp/BasicCMIRP?wsdl", {
   headers: {
      'Content-Type': 'text/xml;charset=UTF-8',
      'Accept-Encoding':'gzip,deflate',
      'username':'soap_sesame_dash',
      'password':'ii70mseq',
      'Host': 'rhel084:8080'
  },
content:
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '+
    'xmlns:bas="http://www.3gpp.org/ftp/specs/archive/32_series/32.606/BasicCMIRPData">' +
    '<soapenv:Header/>'+
    '<soapenv:Body>'+
    '<bas:setMOAttributes>'+
    '<queryXpathExp>//*[@DN="'+path+'"]/*[@RegisteredAs]</queryXpathExp>'+
    '<modificationList>'+
    '<AttributeModification>'+
    '<attribute registeredAs="'+attr+'">'+value+'</attribute>'+
    '<operator>REPLACE</operator>'+
    '</AttributeModification>'+
    '</modificationList>'+
    '</bas:setMOAttributes>'+
    '</soapenv:Body>'+
    '</soapenv:Envelope>'
 }, function (err, result) {
  if (err) {
    console.log('error occurred..');
    console.log(err+"from mysoapcall");
    console.log(path,attr,value);
    return;
  }
  //console.log(result.content);
  console.log('----------------------miki');
  console.log(path,attr,value);
  //Logs.insert({ res: result.content, name: netf});
//  Logs.remove({});


  });
},



///////////////////////////////////////////////////////////////////////andreas_end
});







/*
Meteor.methods({
  addgeodata: function (lat, lon) {
    Userdata.insert({
      lat: lat,
      lon: lon,
      createdAt: new Date()
    });
  }



});

*/

/*
Meteor.method("geodata", function (data) {

  Geodatafinal.insert({
      deviceid: data["deviceid"],
      lat: data["lat"],
      lon: data["lng"],
      createdAt: new Date()
    });

    return "success";
}, {

  url: "geodata"

  }
)

Meteor.method("return-five", function () {

  Geodata.insert({
      fores: 5
    });

  return 5;
}, {
  url: "returnfive",
  httpMethod: "get"
  }
)
*/
