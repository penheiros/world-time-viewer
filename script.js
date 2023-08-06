var root = document.querySelector(':root');
var hour12 = true;
var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

setInterval(function displayTime() {

    var dateTime = new Date().toLocaleString('en-US', {
        hour12 : hour12, timeStyle: 'full', timeZone: timezone
    });

    var time = dateTime.split(' ')[0];
    var amOrPm = dateTime.split(' ')[1];
    var timezoneName = dateTime.split(' ').slice(2).join(' ');

    globalThis.timeDisplay = document.querySelector('#time-display');
    globalThis.timezoneDisplay = document.querySelector('#timezone-display');
    
    timeDisplay.innerHTML = `${time} ${amOrPm=='AM'||amOrPm=='PM' ? amOrPm : ''}`;
    timezoneDisplay.innerHTML = timezoneName;

}, 1000)
// Switching between military and 12 hour time
toggleButton = document.querySelector('#toggle-time');
document.querySelector('#toggle-time').addEventListener('click', ()=> {
    toggleState = toggleButton.className;

    // Time switching to military time
    if (toggleState == 'hour12') {
        hour12 = false;
        toggleButton.classList.toggle('hour12');
        toggleButton.innerHTML = '12 H';
    // Time switching to 12 hour time
    } else {
        hour12 = true;
        toggleButton.classList.toggle('hour12');
        toggleButton.innerHTML = '24 H';
    }
    timeDisplay.innerHTML = '....'
    
})
// Handling background changes
var backgrounds;
var backgroundChangeCount = 0;
var backgroundContainer = document.querySelector('[data-body]');
var borderStyleValue = getComputedStyle(root).getPropertyValue('--box-shadow-properties');

fetch('data-files/backgrounds.json')
.then(response => response.json())
.then(data => {backgrounds = data.map(background => {return {name: background.name, color: background.color}})});

document.querySelector('#background-change').addEventListener('click', ()=> {
    var backgroundKeys = Object.keys(backgrounds)
    var background = backgrounds[backgroundKeys[backgroundChangeCount]];
    var elementsToChange = document.querySelectorAll('.secondary-container button, .secondary-container h1');

    // Separate border properties changes for black and white colors
    if (background.name == 'black') {
        root.style.setProperty('--box-shadow-properties', '0px 0px 5px 0px #fff');
        elementsToChange.forEach(element => {element.style.color = 'white'});
    }

    else if (background.name == 'white') {
        root.style.setProperty('--box-shadow-properties', '0px 0px 20px 10px rgba(16,16,16,0.06)');
        elementsToChange.forEach(element => {element.style.color = 'black'});
    } 
    else {
        root.style.setProperty('--box-shadow-properties', '0px 0px 20px 10px rgba(16,16,16,0.06)');
        elementsToChange.forEach(element => {element.style.color = 'white'});
    };

    backgroundContainer.style.backgroundImage = background.color;
    if (backgroundChangeCount == backgroundKeys.length - 1) {backgroundChangeCount = 0;} 
    else {backgroundChangeCount++;}
})

// Handling timezone changes
var timezoneButton = document.querySelector('#timezone-change');
var timezoneOptions = document.querySelector('#timezone-options');
var timezoneExit = document.querySelector('#exit-button');
var timezoneContainer = document.querySelector('#timezone-container');
var timezoneList;
fetch('data-files/timezones.json')
    .then(response => response.json())
    .then(data => {timezoneList = data.map(timezone => {
            var option = document.createElement('button');
            timezoneContainer.appendChild(option);
            option.setAttribute('id', 'timezone'); 
            option.innerHTML = timezone.timezone;
            globalThis.timezones = timezoneContainer.querySelectorAll('#timezone');

            return {timezoneName: timezone.timezone, timezoneButton: option};
        })
    });

// Displaying timezone options
timezoneButton.addEventListener('click', ()=> {
    timezoneOptions.showModal();
    timezones.forEach(timezoneButton => {
        timezoneButton.style.display = 'block'; timezoneButton.style.transition = 'letter-spacing 0.5s';
        // Displaying timezone
        timezoneButton.addEventListener('click', ()=> {
            timezone = timezoneButton.innerHTML;
            timeDisplay.innerHTML = '....';
            closeOptions();
        })
        // Timezone searchbar
        globalThis.searchBar = document.querySelector('#search-bar');
        searchBar.addEventListener('input', _.debounce(event => {
            var input = event.target.value.toLowerCase().replace(' ', '');
            timezoneList.forEach(timezone => {
                var visible = timezone.timezoneName.toLowerCase().replace('_', '').includes(input);
                timezone.timezoneButton.style.display = visible ? 'block' : 'none';
            })
        }), 300)

    });
})

// Closing timezone options
function closeOptions() {
    timezoneOptions.close();
    searchBar.value = '';
    timezones.forEach(timezoneButton => {timezoneButton.style.display = 'none';})
}
timezoneExit.addEventListener('click', closeOptions);