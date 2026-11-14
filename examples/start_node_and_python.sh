#!/bin/bash

# script pour lancer plusieurs scripts au démarrage
/opt/server-api/node index.js
sleep 2 
/opt/server-api/python-service/python3 app.py
