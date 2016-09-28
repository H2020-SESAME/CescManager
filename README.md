# CescManager

First of all we need to install Meteor

`curl https://install.meteor.com/ | sh`

Then we need to install all the plugins required by the project

`cd CescManager/cesc`
`meteor add twbs:bootstrap fortawesome:fontawesome http iron:router \
yp2:admin-lte rochal:slimscroll accounts-password natestrauser:select2 \
tarzak:gridstackjs d3js:d3 spiderable gadicohen:phantomjs `

after this step you just run the meteor command in the folder to start the server
`meteor`

The server should be running at the port 3000
so you can access it through http://<IP>:3000

In order to run the agent of the cesc-manager, you just need Python 2.7 and the openstack python agents

`apt install python-dev python-pip`
`pip install python-heatclient`
`pip install python-keystoneclient`

and then run the agent

`python mg-agent.py`


