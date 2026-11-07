#!/usr/bin/python3
# coding: utf-8

import sys


fichier = open("data/essai.txt", "r")
don = fichier.read()
print(don) 
fichier.close()