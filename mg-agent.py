import socket
import sys
import os
import time
import argparse
from keystoneclient.v2_0 import client
from heatclient.client import Client
import json
import yaml
from subprocess import call
import pymongo




def autheticate(cip, username, password, tenant): #function used to autheticate with keystone
    #print "authenticating with user "+str(username)+" tenant "+str(tenant)+" and pass "+str(password)
    auth_url = 'http://'+ str(cip)+':5000/v2.0'
    keystone = client.Client(username=username, password=password, tenant_name=tenant, auth_url=auth_url)
    auth_token = keystone.auth_ref['token']['id']
    tenant_id = keystone.tenant_id
    heat_url = 'http://'+str(cip)+':8004/v1/%s' % tenant_id
    heat = Client('1', endpoint=heat_url, token=auth_token)
    return heat

def findPort(mac):
   mac = mac[9:17]
   #print mac
   helper3 = os.popen("ovs-ofctl dump-ports-desc br-int | grep "+mac).read()
   #print helper3
   helping = ""
   for i in range(1,len(helper3)):
      #print helper3[i]
      if (helper3[i]=="("):
          break
      helping = helping+helper3[i]
   #print helping
   return helping
   #return "ok"

# Create a TCP/IP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Bind the socket to the port
server_address = ('10.143.0.209', 33333)
print >>sys.stderr, 'starting up on %s port %s' % server_address
sock.bind(server_address)
i=0

clientMongo = pymongo.MongoClient("localhost", 3001)
db = clientMongo.meteor

glid = "test1"

while True:
    data, address = sock.recvfrom(4096)
    print >>sys.stderr, data
    
    if ":" in data:
        datas = data.split(':')
        source = datas[2]
        destination = datas[1]
    else:
        datas = "null"
    j=-1
    if (datas[0]=='spawn'):
        for vnf in datas:
            j=j+1
            if (vnf!='spawn'):
                print vnf
                if (vnf=='vFW'):
                    print "nova boot --image firewall --flavor m1.small --nic net-id=dc160fbe-2cd5-41c6-8d44-c1b0f962f66b "+datas[j+1]
                    #os.system("nova boot --image firewall --flavor m1.small --nic net-id=dc160fbe-2cd5-41c6-8d44-c1b0f962f66b vfw"+str(i))
                elif (vnf=='vSG'):
                    print "nova boot vSG"
                    os.system("nova boot --image satgw4 --flavor m1.small --nic port-id=dd3d57c6-2175-448f-afea-578f0aede160 --nic port-id=0044ce1d-9d68-4ed1-8e9e-eadaf37e1fe4 "+datas[j+1])
                    time.sleep(6)
                    helper = os.popen("nova show "+datas[j+1]+" | grep vital2-net").read()
                    #print helper
                    theone = ""
                    helperarray = helper.split(" ")
                    for helperitem in helperarray:
                        if "." in helperitem:
                            theone = helperitem
                    helper2 = os.popen("neutron port-list | grep "+theone).read()
                    #print "H ip einai->"+theone
                    helperarray2 = helper2.split(" ")
                    theone2 = ""
                    #print helperarray2
                    for helperitem2 in helperarray2:
                        if "fa:16:3e" in helperitem2:
                            theone2 = helperitem2


                    ovsport = findPort(theone2)
                    print ovsport
                    #print "source:"+source
                    #print "destination:"+destination
                    os.system("ovs-ofctl add-flow br-ex priority=99,dl_type=0x800,in_port=1,nw_src="+source+",nw_dst="+destination+",actions=output:3")
                    os.system("ovs-ofctl add-flow br-int priority=108,dl_type=0x800,in_port=5,nw_src="+source+",nw_dst="+destination+",actions=mod_dl_dst:fa:16:3e:68:fc:99,mod_nw_dst:192.168.8.4,mod_dl_src:fa:16:3e:30:e0:e6,mod_nw_src:192.168.7.36,output:"+ovsport)
                elif (vnf=='vMT'):
                    yamlfl = str('watermark.yaml')
	            with open(yamlfl, 'r') as stream:
		         try:
                             data=stream.read()
                             yamlh = yaml.load(stream)
			     print(yamlh)
		         except yaml.YAMLError as exc:
			     print(exc)

                    cip = '10.143.0.209'
                    username = 'admin'
                    password = 'ii70mseq'
                    tenant = 'admin'
                    heat = autheticate(cip, username, password, tenant)
                    stackname='vwater-sesame'
                    
                    #stack = heat.stacks.create(stack_name=stackname, template=data)
                    glid = datas[j+1]
                    glid = glid[:-2]
		    #print "nova boot --image vMT --flavor m1.medium --nic net-id=dc160fbe-2cd5-41c6-8d44-c1b0f962f66b "+datas[j+1]
                    #os.system("nova boot --image vmt1-snap-fin --flavor m1.medium --nic net-id=dc160fbe-2cd5-41c6-8d44-c1b0f962f66b "+datas[j+1])
		    #os.system("nova show vmt"+str(i)+" | grep network")

                    

                else:
                    print "UNKNOWN VNF-skipping";

            i=i+1
    elif ("delete" in data):
        #os.system("ssh -i /home/mnlab1/def_key.pem ubuntu@10.143.0.214 'killall ffmpeg'")
        TCP_IP = "192.168.3.7"
        TCP_PORT = 7777
        MESSAGE = "stop"
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # UDP
	s.connect((TCP_IP, TCP_PORT))
        s.send(MESSAGE)
        s.close()
        print "stopping service"
        cip = '10.143.0.209'
        username = 'admin'
        password = 'ii70mseq'
        tenant = 'admin'
        heat = autheticate(cip, username, password, tenant)
        stacks = heat.stacks.list()
        while True:
            try:
                stack = stacks.next()
		heat.stacks.delete(stack_id=stack.id)                
		print stack.stack_name + " (" + stack.id + "): " + stack.stack_status
            except StopIteration:
        	break        
    elif ("HWaddr" in data):
        db.deployednetworkservices.update_one({"_id":glid},{"$set": {"started":"0"}})
        index = data.find("HWaddr")
        mac = data[index+7:]
        TCP_IP = "192.168.3.7"
        TCP_PORT = 7777
        MESSAGE = mac
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # UDP
	s.connect((TCP_IP, TCP_PORT))
        s.send(MESSAGE)
        s.close()
        #print datas
    elif ("start" in data):
        TCP_IP = "192.168.3.7"
        TCP_PORT = 7777
        MESSAGE = "start"
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # UDP
	s.connect((TCP_IP, TCP_PORT))
        s.send(MESSAGE)
        s.close()
        print "starting service" 
    elif ("stop" in data):
        #os.system("ssh -i /home/mnlab1/def_key.pem ubuntu@10.143.0.214 'killall ffmpeg'")
        TCP_IP = "192.168.3.7"
        TCP_PORT = 7777
        MESSAGE = "stop"
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # UDP
	s.connect((TCP_IP, TCP_PORT))
        s.send(MESSAGE)
        s.close()
        print "stopping service"   
    elif ("10.143." in data):
        floatingIP = data
        print "floating ip :"+data  







        


    #os.system("nova boot --image ubuntu1404 --flavor m1.small --nic net-id=3df07a25-2cb2-475c-97cd-a29eafa07c2d vFW"+str(i))

