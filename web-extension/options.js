const genres = {
    'afrobeat': '#f50b0b',
    'alternative': '#fb5b33',
    'ambient': '#fa8335',
    'bluegrass': '#fe9b07',
    'blues': '#fad337',
    'classical': '#fdfd0c',
    'country': '#c7f413',
    'chill': '#a8f830',
    'dnb': '#82fb32',
    'dubstep': '#3ef211',
    'electronic': '#0df50d',
    'electro': '#1cf748',
    'experimental': '#24fb7a',
    'emo': '#1ff7a1',
    'folk': '#2bf6cd',
    'funk': '#0df9f9',
    'garage': '#15c8f5',
    'hardcore': '#1fa0f7',
    'hip-hop': '#2779f4',
    'house': '#3159fb',
    'indie': '#1010f9',
    'instrumental': '#582ffe',
    'jazz': '#7117f8',
    'lo-fi': '#a31cfd',
    'metal': '#d02afa',
    'orchestral': '#f731f7',
    'piano': '#f739d1',
    'pop': '#f60e99',
    'post': '#fe2c80',
    'prog': '#f70e3d',
    'punk': '',
    'psychedelic': '',
    'rnb': '#f90909',
    'rock': '#f90909',
    'soul': '#77f821',
    'surf': '#2afc2a',
    'swing': '#0568fe',
    'trap': '#fc31d3',
    'vintage': '#7b22ff',
    'world': '#08f938',
}

// Saves options to chrome.storage
const saveOptions = () => {
    let allGenreNames = document.getElementsByClassName('genreName')
    let allColorNames = document.getElementsByClassName('colorName')

    let data = {}

    for (let i = 0; i < allGenreNames.length; i++) {
        let name = allGenreNames[i].value
        let color = allColorNames[i].value
        data[name] = color
    }

    chrome.storage.local.set({
        colors: data
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 2750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
    chrome.storage.local.get('colors', function (data) {
            if (!data || Object.keys(data).length === 0 || Object.keys(data.colors).length === 0) {
                createColorsUI(genres);
            } else {
                createColorsUI(data.colors);
            }
        });
}

const createColorsUI = (data) => {
    for (let variable in data) {
        if (data.hasOwnProperty(variable)) {
            let genreInputLabel = document.createElement('span')
            genreInputLabel.innerText = 'Genre:'
            let genreInput = document.createElement('input')
            genreInput.className = 'genreName'
            genreInput.type = 'text'
            genreInput.value = variable
            let colorInputLabel = document.createElement('span')
            colorInputLabel.innerText = 'Color:'
            let colorInput = document.createElement('input')
            colorInput.className = 'colorName'
            colorInput.type = 'color'
            colorInput.value = data[variable]
            let removeButton = document.createElement('button')
            removeButton.innerText = 'Remove'

            let group = document.createElement('div')
            group.appendChild(genreInputLabel)
            group.appendChild(genreInput)
            group.appendChild(colorInputLabel)
            group.appendChild(colorInput)
            group.appendChild(removeButton)

            let container = document.getElementById('container')
            container.appendChild(group)
        }
    }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
