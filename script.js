var hour12 = true

setInterval(function displayTime() {

    var dateTime = new Date().toLocaleString('en-US', {hour12 : hour12, timeStyle: 'full'});
    var time = dateTime.split(' ')[0];
    var amOrPm = dateTime.split(' ')[1];

    var timeDisplay = document.querySelector('#time');
    var timezoneDisplay = document.querySelector('#timezone')
    
    
    timeDisplay.innerHTML = `${time} ${amOrPm=='AM'||amOrPm=='PM' ? amOrPm : ''}`;
    timezoneDisplay.innerHTML = `${dateTime.split(' ')[2]} ${dateTime.split(' ')[3]}`;

}, 1000)

// Switching between military and 12 hour time
toggleButton = document.querySelector('#toggle-time');
document.querySelector('#toggle-time').addEventListener('click', ()=> {
    toggleState = toggleButton.className;
    if (toggleState == 'hour12') {
        hour12 = false;
        toggleButton.classList.toggle('hour12');
        toggleButton.innerHTML = '12 H';
    } else {
        hour12 = true;
        toggleButton.classList.toggle('hour12');
        toggleButton.innerHTML = '24 H';
    }
})

// Handling background changes
var backgrounds = {
    'red' : 'linear-gradient(lightcoral, lightcoral)',
    'blue': 'linear-gradient(rgba(143,194,255,1), rgba(143,194,255,1))',
    'pink': 'linear-gradient(lightpink, pink)',
    'green' : 'linear-gradient(lightgreen, lightgreen)',
    'pinkblue' : 'linear-gradient(90deg, rgba(213,144,255,1) 0%, rgba(29,223,253,1) 50%, rgba(213,144,255,1) 100%)'
}
var backgroundChangeCount = 0;

document.querySelector('#background-change').addEventListener('click', ()=> {
    var backgroundContainer = document.querySelector('#container');
    var backgroundKeys = Object.keys(backgrounds)
    backgroundContainer.style.backgroundImage = backgrounds[backgroundKeys[backgroundChangeCount]];
    if (backgroundChangeCount == backgroundKeys.length - 1) {backgroundChangeCount = 0;} 
    else {backgroundChangeCount++;}
})

// Handling timezone changes

var timezoneButton = document.querySelector('#timezone-change');
var timezoneOptions = document.querySelector('#timezone-options');
var timezoneExit = document.querySelector('#exit-button');
var timezoneContainer = document.querySelector('#timezone-container');
timezoneButton.addEventListener('click', ()=> {timezoneOptions.showModal();})
timezoneExit.addEventListener('click', ()=> {timezoneOptions.close();})


fetch('timezones.json')
    .then(response => response.json())
    .then(data => {
        data.map(timezone => {
            var option = document.createElement('button');
            timezoneContainer.appendChild(option);
            option.innerHTML = timezone.timezone;
        })
    })