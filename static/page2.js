let processes = [];


/* =========================
   ADD PROCESS
========================= */

function addProcess() {

    let pid =
    document.getElementById("pid").value;

    let arrival =
    parseInt(
        document.getElementById("arrival").value
    );

    let burst =
    parseInt(
        document.getElementById("burst").value
    );

    let priority =
    parseInt(
        document.getElementById("priority").value
    );

    let type =
    document.getElementById("type").value;

    let name =
    document.getElementById("name").value;


    /* VALIDATION */

    if(
        pid === "" ||
        isNaN(arrival) ||
        isNaN(burst)
    ){

        alert(
            "Please fill all required fields"
        );

        return;
    }


    /* CREATE PROCESS OBJECT */

    let process = {

        pid: pid,

        arrival: arrival,

        burst: burst,

        priority: priority || 0,

        type: type,

        name: name
    };


    /* SAVE IN ARRAY */

    processes.push(process);


    /* SAVE LOCAL STORAGE */

    localStorage.setItem(
        "processes",
        JSON.stringify(processes)
    );


    /* UPDATE TABLE */

    updateTable();


    /* CLEAR INPUTS */

    clearInputs();
}



/* =========================
   UPDATE TABLE
========================= */

function updateTable() {

    let body =
    document.getElementById(
        "tableBody"
    );

    body.innerHTML = "";


    processes.forEach(p => {

        body.innerHTML += `

        <tr>

            <td>${p.pid}</td>

            <td>${p.arrival}</td>

            <td>${p.burst}</td>

            <td>${p.priority}</td>

            <td>${p.type}</td>

            <td>${p.name}</td>

        </tr>

        `;

    });

}



/* =========================
   CLEAR INPUTS
========================= */

function clearInputs() {

    document.getElementById("pid").value = "";

    document.getElementById("arrival").value = "";

    document.getElementById("burst").value = "";

    document.getElementById("priority").value = "";

    document.getElementById("name").value = "";

}



/* =========================
   LOAD SAVED DATA
========================= */
localStorage.removeItem("processes");

window.onload = function(){

    let savedProcesses = JSON.parse(
        localStorage.getItem("processes")
    );

    if(savedProcesses){

        processes = savedProcesses;

        updateTable();
    }

}



/* =========================
   NEXT PAGE
========================= */

function nextPage() {

    if(processes.length === 0){

        alert(
            "Add at least one process"
        );

        return;
    }

    /* SAVE AGAIN */

    localStorage.setItem(
        "processes",
        JSON.stringify(processes)
    );

    /* GO TO PAGE 3 */

   window.location.href = "/page3";
}



/* =========================
   BACK HOME
========================= */

function goHome() {

    window.location.href =
    "/";
}