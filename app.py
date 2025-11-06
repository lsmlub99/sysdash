from flask import Flask, render_template, jsonify
import psutil, platform, datetime, os

app = Flask(__name__)
APP_VERSION = os.getenv("APP_VERSION", "dev")

def sysinfo():
    boot = datetime.datetime.fromtimestamp(psutil.boot_time())
    uptime = str(datetime.datetime.now() - boot).split('.')[0]
    return {
        "host": platform.node(),
        "os": f"{platform.system()} {platform.release()}",
        "uptime": uptime,
        "cpu_total": psutil.cpu_percent(interval=0.5),
        "cpu_per_core": psutil.cpu_percent(interval=None, percpu=True),
        "mem_percent": psutil.virtual_memory().percent,
        "swap_percent": psutil.swap_memory().percent,
        "disk": [
            {"mount": p.mountpoint, "percent": psutil.disk_usage(p.mountpoint).percent}
            for p in psutil.disk_partitions(all=False)
            if os.path.ismount(p.mountpoint)
        ],
	"app_version" : APP_VERSION,
    }

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api")
def api():
    return jsonify(sysinfo())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
