from flask import Flask, send_from_directory

app = Flask(__name__, static_folder="assets")

# главная страница
@app.route("/")
def index():
    return send_from_directory(".", "index.html")

# статика
@app.route("/assets/<path:filename>")
def assets(filename):
    return send_from_directory("assets", filename)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
