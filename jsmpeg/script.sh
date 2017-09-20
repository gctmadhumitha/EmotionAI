# /etc/init/jsmpeg-webcam-server.conf
 
description "Webcam streaming server using jsmpeg and node.js"
author      "Madhu"
 
start on local-filesystems and net-device-up IFACE!=eth0
stop on shutdown
 
script
    exec ffmpeg -s 320x240 -f video4linux2 -i /dev/video0 \
 -f mpeg1video -b 400k -r 30 http://localhost:8082/secret/320/240
end script
 
pre-start script
    echo "[`date`] Starting ffmpeg video capture" >> /home/pi/MM/code/trials/jsmpeg/jsmpg.log
end script
 
pre-stop script
    echo "[`date`] Stopping ffmpeg video capture" >> /home/pi/jsmpg.log
end script
