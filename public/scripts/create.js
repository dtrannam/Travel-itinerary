selectedDays = document.querySelector('#days')
informationtable = document.querySelector('#daysinput')


selectedDays.addEventListener('input', () => {
    while (informationtable.firstChild) {
        informationtable.removeChild(informationtable.lastChild)
    }
    let totalDays = parseInt(selectedDays.value) + 1
    console.log(totalDays, selectedDays.value)
    for (let i = 1; i < totalDays; i++) {
        let curLabel = document.createElement('label')
        let curinput = document.createElement('input')
        curLabel.setAttribute('for', i)
        curinput.setAttribute('id', i)
        curinput.setAttribute('name', 'items')
        curLabel.innerText = `Day ${i}:`
        informationtable.appendChild(curLabel)
        informationtable.appendChild(curinput)
        let br = document.createElement('br')
        informationtable.appendChild(br)
    }  
    
    
})