import socket
import sys
import os
import time



# Create a TCP/IP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Bind the socket to the port
server_address = ('10.143.0.209', 33333)
print >>sys.stderr, 'starting up on %s port %s' % server_address
sock.bind(server_address)
i=0

while True:
    data, address = sock.recvfrom(4096)
    print >>sys.stderr, data
    time.sleep(10)
    print "egine"
