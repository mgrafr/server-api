#!/usr/bin/env python3

from flask import Flask, request, jsonify
import subprocess
import os
from flask_cors import CORS

class Config:
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

app = Flask(__name__)
CORS(app)  # autorise toutes les origines

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/run', methods=['POST'])
def run_script():
    data = request.json
    sc_file = data.get('file')
    print(sc_file)
    #nb_file = len(sc_file)
    arg = sc_file.split()
    print(arg)
    script_file = arg[0]
    del arg[0]
    arguments = ' '.join(arg)
     
    if not script_file:
        return jsonify({"error": "Missing script file"}), 400

    script_path = os.path.join("/opt","server-api","scripts", script_file)
    print(script_path)
    if not os.path.exists(script_path):
        return jsonify({"error": "Script not found"}), 404

    ext = script_file.split('.')[-1]
    cmd = []
    if ext == 'py':
        cmd = ['python3', script_path, arguments]
    elif ext == 'sh':
        cmd = ['sh', script_path]
    else:
        return jsonify({"error": "Unsupported extension"}), 400

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        return jsonify({
            "valeur": result.stdout.strip(),
            #"statut erreur": result.stderr.strip(),
            "arguments": arguments,
            "exit_code": result.returncode
        })
    except subprocess.TimeoutExpired:
        return jsonify({"error": "Script timed out"}), 500

if __name__ == '__main__':
   app.run(host='0.0.0.0', port=5004, debug=False, use_reloader=False)
