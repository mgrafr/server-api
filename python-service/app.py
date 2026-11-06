#!/usr/bin/env python3

from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

@app.route('/run', methods=['POST'])
def run_script():
    data = request.json
    script_name = data.get('name')

    if not script_name:
        return jsonify({"error": "Missing script name"}), 400

    script_path = os.path.join("/scripts", script_name)

    if not os.path.exists(script_path):
        return jsonify({"error": "Script not found"}), 404

    ext = script_name.split('.')[-1]
    cmd = []
    if ext == 'py':
        cmd = ['python3', script_path]
    elif ext == 'sh':
        cmd = ['sh', script_path]
    else:
        return jsonify({"error": "Unsupported extension"}), 400

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        return jsonify({
            "stdout": result.stdout.strip(),
            "stderr": result.stderr.strip(),
            "exit_code": result.returncode
        })
    except subprocess.TimeoutExpired:
        return jsonify({"error": "Script timed out"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
