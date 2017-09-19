# /etc/init/jsmpeg-webcam-server.conf
 
description "Webcam streaming server using jsmpeg and node.js"
author      "MyContraption.com"
 
start on (local-filesystems and net-device-up IFACE!=eth0)
stop on shutdown
 
script
    exec ffmpeg -s 320x240 -f video4linux2 -i /dev/video0 \
 -f mpeg1video -b 400k -r 30 \
 -vf "drawtext=fontfile=/usr/share/fonts/truetype/ttf-dejavu/DejaVuSans.ttf: text='MyContraption.com': fontsize=10:fontcolor=white@1.0: box=1: boxcolor=black@0.5: x=7: y=220, drawtext=fontfile=/usr/share/fonts/truetype/ttf-dejavu/DejaVuSans.ttf: text='%{localtime} EST (GMT -6)': fontsize=10:fontcolor=white@1.0: box=1: boxcolor=black@0.5: x=(w-175): y=220" http://localhost:8082/SecretCodeGoesHere/320/240
end script
 
pre-start script
    echo "[`date`] Starting ffmpeg video capture" >> /home/pi/Devel/Webcam/jsmpeg/jsmpg.log
end script
 
pre-stop script
    echo "[`date`] Stopping ffmpeg video capture" >> /home/pi/jsmpg.log
end script
