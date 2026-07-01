window.onload = function () {

    let algorithm =
        localStorage.getItem("algorithm");

    let processes =
        JSON.parse(localStorage.getItem("processes"));

    if (!processes || processes.length === 0) {

        alert("No processes found");

        return;
    }

    document.getElementById("algoName").innerText =
        "Selected Algorithm: " + algorithm;

    document.getElementById("totalProcesses").innerText =
    "Total Processes: " + processes.length;

    let results = [];

    // =========================
    // FCFS
    // =========================

    if (algorithm === "FCFS") {

        results = fcfs(processes);

    }

    // =========================
    // ROUND ROBIN
    // =========================

    else if (algorithm === "Round Robin") {

        let tq =
            parseInt(localStorage.getItem("timeQuantum"));

        results = roundRobin(processes, tq);
    }

    // =========================
    // PRIORITY NP
    // =========================

    else if (
        algorithm ===
        "Priority Non-Preemptive"
    ) {

        results =
            priorityNonPreemptive(processes);

    }

    // =========================
    // PRIORITY P
    // =========================

    else if (
        algorithm ===
        "Priority Preemptive"
    ) {

        results =
            priorityPreemptive(processes);

    }

    fillTable(results);

    fillStatistics(results);

    drawGantt(results);
};



// ======================================
// FCFS
// ======================================

function fcfs(processes) {

    let currentTime = 0;

    processes.sort(
        (a, b) => a.arrival - b.arrival
    );

    for (let p of processes) {

        if (currentTime < p.arrival) {

            currentTime = p.arrival;
        }

        p.start = currentTime;

        currentTime += p.burst;

        p.completion = currentTime;

        p.turnaround =
            p.completion - p.arrival;

        p.waiting =
            p.turnaround - p.burst;

        p.response = p.waiting;
    }

    return processes;
}



// ======================================
// ROUND ROBIN
// ======================================

function roundRobin(processes, tq) {

    let queue = [];

    let currentTime = 0;

    let completed = 0;

    processes.forEach(p => {

        p.remaining = p.burst;

        p.completed = false;

        p.started = false;
    });

    queue.push(processes[0]);

    while (completed < processes.length) {

        let p = queue.shift();

        if (!p.started) {

            p.response =
                currentTime - p.arrival;

            p.started = true;
        }

        let execute =
            Math.min(tq, p.remaining);

        currentTime += execute;

        p.remaining -= execute;

        processes.forEach(proc => {

            if (
                proc.arrival <= currentTime &&
                !queue.includes(proc) &&
                !proc.completed &&
                proc !== p
            ) {

                queue.push(proc);
            }
        });

        if (p.remaining > 0) {

            queue.push(p);

        } else {

            p.completed = true;

            completed++;

            p.completion = currentTime;

            p.turnaround =
                p.completion - p.arrival;

            p.waiting =
                p.turnaround - p.burst;
        }
    }

    return processes;
}



// ======================================
// PRIORITY NP
// ======================================

function priorityNonPreemptive(processes) {

    let currentTime = 0;

    let completed = [];

    while (
        completed.length < processes.length
    ) {

        let ready = processes.filter(p =>

            p.arrival <= currentTime &&
            !completed.includes(p)
        );

        if (ready.length === 0) {

            currentTime++;

            continue;
        }

        ready.sort(
            (a, b) => a.priority - b.priority
        );

        let p = ready[0];

        p.start = currentTime;

        p.response =
            currentTime - p.arrival;

        currentTime += p.burst;

        p.completion = currentTime;

        p.turnaround =
            p.completion - p.arrival;

        p.waiting =
            p.turnaround - p.burst;

        completed.push(p);
    }

    return processes;
}



// ======================================
// PRIORITY PREEMPTIVE
// ======================================

function priorityPreemptive(processes) {

    let currentTime = 0;

    let completed = 0;

    processes.forEach(p => {

        p.remaining = p.burst;

        p.started = false;
    });

    while (completed < processes.length) {

        let ready = processes.filter(p =>

            p.arrival <= currentTime &&
            p.remaining > 0
        );

        if (ready.length === 0) {

            currentTime++;

            continue;
        }

        ready.sort(
            (a, b) => a.priority - b.priority
        );

        let p = ready[0];

        if (!p.started) {

            p.response =
                currentTime - p.arrival;

            p.started = true;
        }

        p.remaining--;

        currentTime++;

        if (p.remaining === 0) {

            completed++;

            p.completion = currentTime;

            p.turnaround =
                p.completion - p.arrival;

            p.waiting =
                p.turnaround - p.burst;
        }
    }

    return processes;
}



// ======================================
// FILL TABLE
// ======================================

function fillTable(results) {

    let body =
        document.getElementById("resultsBody");

    body.innerHTML = "";

    results.forEach(p => {

        body.innerHTML += `

        <tr>

            <td>${p.pid}</td>

            <td>${p.arrival}</td>

            <td>${p.burst}</td>

            <td>${p.priority}</td>

            <td>${p.completion}</td>

            <td>${p.turnaround}</td>

            <td>${p.waiting}</td>

            <td>${p.response}</td>

        </tr>

        `;
    });
}



// ======================================
// STATISTICS
// ======================================

function fillStatistics(results) {

    let totalWT = 0;
    let totalTAT = 0;
    let totalRT = 0;

    results.forEach(p => {

        totalWT += p.waiting;
        totalTAT += p.turnaround;
        totalRT += p.response;
    });

    let n = results.length;

    document.getElementById("avgWT").innerText =
        (totalWT / n).toFixed(2);

    document.getElementById("avgTAT").innerText =
        (totalTAT / n).toFixed(2);

    document.getElementById("avgRT").innerText =
        (totalRT / n).toFixed(2);
}



// ======================================
// GANTT CHART
// ======================================

function drawGantt(results) {

    let gantt =
        document.getElementById("ganttChart");

    let times =
        document.getElementById("ganttTimes");

    gantt.innerHTML = "";

    times.innerHTML = "";

    let current = 0;

    times.innerHTML += `<span>0</span>`;

    results.forEach(p => {

        gantt.innerHTML += `

        <div class="gantt-box">

            ${p.pid}

        </div>
        `;

        current = p.completion;

        times.innerHTML += `
            <span>${current}</span>
        `;
    });
}



// ======================================
// BUTTONS
// ======================================

function goBack() {

    window.location.href = "/page3";
}

function tryAnother() {

    window.location.href = "/page2";
}

function saveResults() {

    alert("Results Saved Successfully");
}

function compareAll() {

    alert("Comparison Page Coming Soon");
}