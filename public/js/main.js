/*--------- Confidential Info ----------*/
const infoPasskey = 'osoc@nitt';

/*--------- End of Confidential Info ----------*/

// It prevents to fire transitions on page load 
window.onload = function() {
    document.body.className += " loaded";
}


/*----- Alerting User -----*/
const alertMsg = (msg, color = "red") => {
    DOMElements.modalPara.innerHTML = "";
    let resultMarkup = `
    <div class = "modal--error">
        <b class = "modal--error__msg ${color}">${msg}</b>
    </div>`;

    DOMElements.modalHeading.innerHTML = "!!! Alert";
    DOMElements.modalPara.insertAdjacentHTML('beforeend', resultMarkup);
    DOMElements.modalBody.style.display = "block";
}

/*----- End of Alert Function -----*/


// Creating object for DOM Elements
const DOMElements = {
    inputName : document.querySelector('.form__field__input--name'),
    inputRollNo : document.querySelector('.form__field__input--roll'),
    inputCand : document.querySelector('.form__field__select--cand'),
    btnVote : document.querySelector('.form__field__submitBtn'),
    btnResult : document.querySelector('.form__field__resultBtn'),
    modalBody : document.querySelector('.modal'),
    modalClose : document.querySelector('.close'),
    modalPara : document.querySelector('.modal-content__para'),
    modalHeading : document.querySelector('.modal-content__header'),
    btnClearData : document.querySelector('.form__field__clearDataBtn')
}


// This is used to create structure to store candidate info
class Candidate {
    constructor(name) {
        this.name = name;
        this.vote = '0';
        this.peopleVoted  = [];
    }

    incrementVote() {
        this.vote = Number(this.vote) + 1;
    }
}


/*---- Initializing the candidates info -----*/
// Initializing only if it does not exist already in Local Storage

/*--- For Testing Purpose ---*/
// localStorage.removeItem('totalCandVoted');
// localStorage.removeItem('votes');

if(!localStorage.getItem('totalCandVoted')) {
    let cand1 = new Candidate('Aman');
    let cand2 = new Candidate('Bala');
    let cand3 = new Candidate('Chaksu');
    let cand4 = new Candidate('Raj');
    let cand5 = new Candidate('Rishabh');

    let candidates = [cand1, cand2, cand3, cand4, cand5];
    localStorage.setItem('votes', JSON.stringify(candidates));
    let totalVoted = [];
    localStorage.setItem('totalCandVoted', JSON.stringify(totalVoted));
}


// console.log(parsedData[0]);

/*----- Accessing DOM Elements -----*/
const checkRoll = (el) => {
    if(el == DOMElements.inputRollNo.value) return true;
    return false;
}

/*----- Validate the Duplication and Correctness of Roll No. -----*/
const validateInput = (name, roll) => {

    if(!(roll > 0 && roll < 116)) {
        alertMsg('Please enter a valid Roll no, i.e [1 to 115]');
        return false;
    }
    
    if(name.length < 2 || !isNaN(name)) {
        alertMsg("Please enter a valid name ");
        return false;
    }

    let totalVoted = JSON.parse(localStorage.getItem('totalCandVoted'));
    if(!totalVoted) {
        alertMsg("Please cast atleast two votes to check results.");
        return;
    }

    if(totalVoted.find(checkRoll)) {
        alertMsg("You've already voted, don't try to act smart.");
        return false;
    }
    else {
        totalVoted.push(Number(roll));
        localStorage.setItem('totalCandVoted', JSON.stringify(totalVoted));
        return true;
    }
}

/*---- End of Validate Function ----*/


// Reseting Input Fields 
const clearInputFields = () => {
    DOMElements.inputName.value = "";
    DOMElements.inputRollNo.value = ""
}

/*-------- Showing Detail Info of Candidate ----------*/
const showDetails = () => {
    let parsedData = JSON.parse(localStorage.getItem('votes'));

    let paraCand = ``;
    

    for(let i = 0; i < parsedData.length; i++) {
        paraCand = paraCand + `<p><b>${parsedData[i].name} : </b>(${parsedData[i].peopleVoted})</p>`
    }

    let detailMarkup = `
    <div class = "modal--result">
    <p class = "modal--result__total">Roll No. of People who voted </p>
        ${paraCand}
    </div>
    `;

    DOMElements.modalPara.innerHTML = "";
    DOMElements.modalHeading.innerHTML = "!!! Details";
    DOMElements.modalPara.insertAdjacentHTML('beforeend', detailMarkup);
    DOMElements.modalBody.style.display = "block";

}


/*------------ Vote Cast Function ------------*/
const vote = () => {
    // console.log("Vote btn clicked..")
    
    let candName = DOMElements.inputName.value;
    let rollNo = DOMElements.inputRollNo.value;
    if(!validateInput(candName, rollNo)) return; 
    // Returning if any validation fails
    
    let selectedCand = DOMElements.inputCand.value;
    let parsedData = JSON.parse(localStorage.getItem('votes'));

    for(let i = 0; i < 5; i++) {
        if(parsedData[i].name == selectedCand) {
            parsedData[i].vote = Number(parsedData[i].vote) + 1;
            parsedData[i].peopleVoted.push(rollNo);
            localStorage.setItem('votes', JSON.stringify(parsedData));
            alertMsg("Thanks For Voting...", "green");
            clearInputFields();
            break;
        }
    }

    
}
/*------------ End of Vote Cast Function ------------*/

DOMElements.btnVote.addEventListener('click', vote);


/*------ Showing Result of Voting -------*/
const showResult = () => {

    let totalVoted = JSON.parse(localStorage.getItem('totalCandVoted'));
    let parsedData = JSON.parse(localStorage.getItem('votes'));
    
    if(!totalVoted) {
        alertMsg("Please cast atleast two votes to check results.");
        return;
    }
    
    let cr = {vote: 0}, ccm= {vote: -1};

    // Finding Max and secondMax Voted Candidates
    for(let i = 0; i < parsedData.length; i++) {
        if(parsedData[i].vote > cr.vote) {
            ccm = cr;
            cr = parsedData[i];
        }

        else if(parsedData[i].vote > ccm.vote) {
            ccm = parsedData[i];
        }
    }

    if(ccm.vote == 0 || cr.vote == 0) {
        alertMsg("Please cast atleast two votes to check results.");
        return;
    }
    
    DOMElements.modalPara.innerHTML = "";
    let resultMarkup = `
    <div class = "modal--result">
        <p class = "modal--result__total">Total Candidates Voted : ${totalVoted.length}</p>
        <p><b>Elected CR :</b> ${cr.name}(${cr.vote})</p>
        <p><b>Elected CCM :</b> ${ccm.name}(${ccm.vote})</p>
        <div class="form__field form__field">
            <input class="form__field__input form__field__input--passkey" type="text" placeholder="Enter Passkey to access detail info"/>
        </div>
        <div class="form__field">
            <button class="form__field__passkeyBtn" id = "btnPasskey">Show Details</button>
        </div>
    </div>`;
    DOMElements.modalHeading.innerHTML = "!!! Result";
    DOMElements.modalPara.insertAdjacentHTML('beforeend', resultMarkup);
    DOMElements.modalBody.style.display = "block";
}
/*------ End of showResult Function -------*/


  


/*------ Showing Details of Voting -------*/
// Using Event Delegation to catch the passkey
document.addEventListener('click', (e) => {
    if(e.target.id == "btnPasskey") {
    let btnPasskey = document.querySelector('.form__field__passkeyBtn');
    let inputPasskey = document.querySelector('.form__field__input--passkey');
   if(inputPasskey.value == infoPasskey) {
    showDetails();
   }
   else {
    alertMsg("Wrong Passkey!!!");
   }
}
});


DOMElements.btnResult.addEventListener('click', showResult)

/*----- Resetting Data ----*/
DOMElements.btnClearData.addEventListener('click', () => {
    localStorage.removeItem('totalCandVoted');
    localStorage.removeItem('votes');
    alertMsg("Resetted Everything..")
})


DOMElements.modalClose.addEventListener('click', ()=> {
    DOMElements.modalBody.style.display = "none";
})

  // Close modal, when clicked outside
window.addEventListener('click', (event) => {
if (event.target == DOMElements.modalBody) {
    DOMElements.modalBody.style.display = "none";
}
})

