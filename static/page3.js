let selectedAlgorithm = null;


/* =========================
   SELECT ALGORITHM
========================= */

function selectAlgorithm(card, name){

    selectedAlgorithm = name;

    document.getElementById(
        "selectedText"
    ).innerText =
    "Selected Algorithm: " + name;


    // REMOVE OLD SELECTION

    let cards =
    document.querySelectorAll(".card");

    cards.forEach(c => {

        c.classList.remove("selected");

    });


    // ADD NEW SELECTION

    card.classList.add("selected");


    // SHOW RR INPUT

    let quantumBox =
    document.getElementById(
        "timeQuantumBox"
    );

    if(name === "Round Robin"){

        quantumBox.style.display = "block";

    }else{

        quantumBox.style.display = "none";

    }
}


/* =========================
   RUN SIMULATION
========================= */

function runSimulation(){

    if(selectedAlgorithm == null){

        alert(
            "Please select an algorithm first"
        );

        return;
    }


    // LOAD PROCESSES

    let processes =
    JSON.parse(
        localStorage.getItem("processes")
    );


    if(!processes){

        alert("No Processes Found");

        return;
    }


    fetch("/run_algorithm", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            algorithm: selectedAlgorithm,

            quantum: parseInt(
                document.getElementById(
                    "timeQuantum"
                ).value
            ) || 0,

            processes: processes
        })
    })

    .then(response => response.json())

    .then(results => {

        localStorage.setItem(
            "results",
            JSON.stringify(results)
        );

        localStorage.setItem(
            "algorithm",
            selectedAlgorithm
        );

        window.location.href = "/results";
    });
}


/* =========================
   BACK
========================= */

function goBack(){

    window.location.href =
    "/page2";
}