from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify

from algorithms import *

app = Flask(__name__)


# ==========================
# PAGES
# ==========================

@app.route("/")
def home():

    return render_template("index.html")


@app.route("/page2")
def page2():

    return render_template("page2.html")


@app.route("/page3")
def page3():

    return render_template("page3.html")


@app.route("/results")
def results():

    return render_template("results.html")


# ==========================
# RUN ALGORITHM
# ==========================

@app.route("/run_algorithm", methods=["POST"])
def run_algorithm():

    data = request.get_json()

    algorithm = data["algorithm"]

    quantum = data.get("quantum", 0)

    processes_data = data["processes"]

    processes = []

    # CREATE PROCESS OBJECTS

    for p in processes_data:

        process = Process(

            p["pid"],
            p["arrival"],
            p["burst"],
            p.get("priority", 0)

        )

        processes.append(process)

    # RUN ALGORITHM

    if algorithm == "FCFS":

        processes = fcfs(processes)

    elif algorithm == "Round Robin":

        processes = round_robin(processes, quantum)

    elif algorithm == "Priority Non-Preemptive":

        processes = priority_non_preemptive(processes)

    elif algorithm == "Priority Preemptive":

        processes = priority_preemptive(processes)

    # CONVERT RESULTS

    results = []

    for p in processes:

        results.append({

            "pid": p.pid,
            "arrival": p.arrival,
            "burst": p.burst,
            "priority": p.priority,

            "completion": p.completion,
            "turnaround": p.turnaround,
            "waiting": p.waiting,
            "response": p.response

        })

    return jsonify(results)


# ==========================
# RUN SERVER
# ==========================

if __name__ == "__main__":

    app.run(debug=True)