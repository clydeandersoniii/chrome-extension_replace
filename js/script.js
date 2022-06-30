async function getData() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['macros'], data => {
            if (data.macros === undefined) {
                reject();
            } else {
                resolve(data.macros)
            }
        });
    })
    .then(result => {
        return result;
    });
}

//adds a macro to the array, then calls to clear the input and update the UI
function addMacro() {
    let macroId;
    let macroReplace;

    macroId = document.getElementById('mname').value.toLowerCase();
    macroReplace = document.getElementById('mreplace').value;

    if (validateInput()) {
        arrMacros.push([macroId, macroReplace]);
        chrome.storage.sync.set({'macros':arrMacros})

        clearInput();
        updateTable();
    } else {
        alert('Please fill out both fields.')
    }
}

function validateInput() {
    let validated;
    validated = true;

    let macroId;
    let macroReplace;

    macroId = document.getElementById('mname');
    macroReplace = document.getElementById('mreplace');

    if ((macroId.value === "" || macroId.value === undefined)) {
        macroId.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
        macroId.style.color = 'white';
        validated = false;
    } else {
        macroId.style.backgroundColor = 'white';
        macroId.style.color = 'black;';
    }

    if ((macroReplace.value === "" || macroReplace.value === undefined)) {
        macroReplace.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
        macroReplace.style.color = 'white';
        validated = false;
    } else {
        macroReplace.style.backgroundColor = 'white';
        macroReplace.style.color = 'black';
    }

    return validated;
}

function deleteMacro(e) {
    let macroId;
    macroId = e.target.id;
    console.log(macroId);

    let length;
    length = arrMacros.length;

    let temp;
    temp = [];

    //iterate through the array and push every value to a temp array that isn't the
    //   macro we're deleting
    for (let i = 0; i < length; i++) {
        console.log(arrMacros[i][0]);
        if (arrMacros[i][0] !== macroId) {
            temp.push([arrMacros[i][0], arrMacros[i][1]]);
        }
    }

    arrMacros = temp;
    chrome.storage.sync.set({'macros':arrMacros})

    //remove from the UI
    let row;
    row = document.querySelector(`tr#${macroId}`)
    row.remove();
}

//clear input boxes
function clearInput() {
    document.getElementById('mname').value = '';
    document.getElementById('mreplace').value = '';
}

//update table in UI with the macros
function updateTable() {
    let table;
    table = document.getElementById('macros');

    let newMacro;
    newMacro = arrMacros[arrMacros.length - 1];

    let row;
    let cell1;
    let cell2;
    let cell3;

    row = table.insertRow();
    row.id = newMacro[0];

    cell1 = row.insertCell(0);
    cell1.innerHTML = newMacro[0];
    cell1.title = `Type !#${newMacro[0]} to use your macro!`

    cell2 = row.insertCell(1);
    cell2.innerHTML = newMacro[1];

    cell3 = row.insertCell(2);
    cell3.innerHTML = `<button id="${newMacro[0]}">Delete</button>`

    document.querySelector(`button#${newMacro[0]}`).addEventListener('click', deleteMacro)
}

//populate the table upon initialization
function populateTable() {
    let table;
    table = document.getElementById('macros');

    let macro;
    let length;
    
    let row;
    let cell1;
    let cell2;
    let cell3;

    length = arrMacros.length;
    for (let i = 0; i < length; i++)
    {
        console.log(macro);
        macro = arrMacros[i];

        row = table.insertRow();
        row.id = macro[0];

        cell1 = row.insertCell(0);
        cell1.innerHTML = macro[0];
        cell1.title = `Type !#${macro[0]} to use your macro!`

        cell2 = row.insertCell(1);
        cell2.innerHTML = macro[1];

        cell3 = row.insertCell(2);
        cell3.innerHTML = `<button class="delete" id="${macro[0]}">Delete</button>`

        document.querySelector(`button#${macro[0]}`).addEventListener('click', deleteMacro)
    }
}

let arrMacros = await getData();
document.getElementById('addmacro').addEventListener('click', addMacro);

populateTable();

