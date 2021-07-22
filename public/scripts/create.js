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
        curLabel.classList.add('form-label')
        curinput.required = true
        curinput.setAttribute('id', i)
        curinput.classList.add('form-control')
        curinput.setAttribute('name', 'items')
        curinput.classList.add('form-input')
        curLabel.innerText = `Day ${i}:`
        informationtable.appendChild(curLabel)
        informationtable.appendChild(curinput)
        let br = document.createElement('br')
        informationtable.appendChild(br)
    }  
})

// const form = document.getElementById('newItem')
// form.addEventListener('submit', function(e) {
//     e.preventDefault()
//     var info = {}
//     const formData = new FormData(this)
    
//     // Creates Key:Value Pairs
//     formData.forEach(function(value, key) {
//         info[key] = value
//         console.log(key)
//     })
//     // Seperate function as item is an array and the above method would override each items
//     itemArr = []
//     document.getElementsByName('items').forEach(element => itemArr.push(element.value));
//     info['items'] = itemArr
//     console.log(info)
//     fetch('/itinerary/create', {
//         method: 'POST',
//         body: JSON.stringify(info),
//         headers: { 'Content-Type': 'application/json'}
//     }).then( res => {
//         return res.json()
//     }).then(data => {
//         window.location.href = `/itinerary/${data}`
//     }).catch(e => 
//         {
//             console.log('errors')
//         })
// })