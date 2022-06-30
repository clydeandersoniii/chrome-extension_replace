//console.log('Text Macro Extension: format.js injected...')

//our macro identifier will follow the format of !#<word>
let regex;
regex = /(\!\#\w+ )/;

let arrMacros = getData();

//any element that gets focus will be listened for all keydown events (i.e. input)
document.addEventListener('focusin', (e) => {
    //console.log(`focus in target: ${e}`)
    e.target.addEventListener('input', formatText);
    arrMacros = getData();
});

//when an element loses focus, remove the event listener
document.addEventListener('focusout', (e) => {
    e.target.removeEventListener('input', formatText);
});

//this will be the function that constantly checks on every input if there
//   is a regex match and replace it with the appropriate macro
// function formatText(e) {
//     //console.log(e);
//     //console.log(`element: ${e.srcElement}`)

//     let input;
//     input = this.value;

//     //console.log(`initial input: ${input}`)

//     let element;
//     if (input === undefined) {
//         element = this.children[0];
//         input = element.innerHTML;
//     } else {
//         element = this;
//     }

//     let macro;
//     try {
//         macro = input.match(regex)[0].trim().substring(2);
//     }
//     catch (err) {
        
//     }

//     arrMacros.then(result => {
//         let length;
//         length = result.length;

//         for (let i = 0; i < length; i++)
//         {
//             if (result[i][0] == macro) {
//                 macro = result[i][1];

//                 if (element.value === undefined) {
//                     element.innerHTML = input.replace(regex, macro);
//                 } else {
//                     element.value = input.replace(regex, macro);
//                 }
                
//                 break;
//             }
//         }
//     })
// }

function formatText(e) {
    let input;
    input = this.value;

    let element;
    let length;
    let child;

    //if the input is undefined, we aren't checking a normal input box,
    //   it's likely some div that was set to content-editable, so we want to check
    //   its children (e.g. <p> tags that are being edited)
    if (input === undefined) {
        length = this.children.length;

        //if it is a div that's content-editable, then each line likely
        //  spawns a new <p> tag so we need to iterate through all of the children
        for (let i =0; i < length; i++) {
            child = this.children[i]; 
            replaceText(child, child.innerHTML);
        }
    } else {
        //if the input isn't undefined, it's likely a normal input box that we can
        //   interact with
        element = this;
        replaceText(element, input);
    }
}

//this is where we actually pass the element and replace the text
function replaceText(element,input){
    let macro;
    let match;

    match = false;

    //first, we just try and find a match for a *potential* macro
    //for example, we want any case matching the format !#<word>
    try {
        macro = input.match(regex)[0].trim().substring(2);
        match = true;
    }
    catch (err) {
        match = false;
    }

    //when we have a match, we will see if the macro is in our list
    //   and replace accordingly
    if (match) {
        arrMacros.then(result => {
            let length;
            length = result.length;

            //iterate through list of macros
            for (let i = 0; i < length; i++)
            {
                //if there's a match
                if (result[i][0] == macro) {
                    macro = result[i][1];

                    //we have to verify once more if this is a normal input
                    //   or something like a content-editable to know what
                    //   prop we should access to change the text
                    if (element.value === undefined) {
                        element.innerHTML = input.replace(regex, macro);
                    } else {
                        element.value = input.replace(regex, macro);
                    }
                    
                    //don't bother finishing the loop if we find a match
                    break;
                }
            }
         })
    }
}

function getData() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['macros'], data => {
            if (data.macros === undefined) {
                reject();
            } else {
                resolve(data.macros)
            }
        });
    })
}