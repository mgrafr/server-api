[Unit]
Description=Lancement de server-api & python-service au demarrage
After=network.target

[Service]
Type=simple
ExecStart=/bin/bash /opt/server-ap/examples/start_node_and_python.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
