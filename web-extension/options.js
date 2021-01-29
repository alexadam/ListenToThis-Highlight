const defaultGenres = {
  'ambient': '#fa8335',
  'blues': '#0df9f9',
  'country': '#fad337',
  'chill': '#a8f830',
  'funk': '#F2EF0C',
  'jazz': '#fba19d',
  'soul': '#aca2bb',
}

const restoreOptions = () => {
  chrome.storage.local.get('colors', (data) => {
    if (!data ||
      Object.keys(data).length === 0 ||
      Object.keys(data.colors).length === 0) {
      createColorsUI(defaultGenres);
    } else {
      createColorsUI(data.colors);
    }
  });
}

const createColorInput = (genre, color, id) => {
  let genreInputLabel = document.createElement('span')
  genreInputLabel.innerText = 'Genre:'
  genreInputLabel.className = 'genreNameLabel'
  let genreInput = document.createElement('input')
  genreInput.className = 'genreName'
  genreInput.type = 'text'
  genreInput.value = genre
  let colorInputLabel = document.createElement('span')
  colorInputLabel.innerText = 'Color:'
  colorInputLabel.className = 'colorNameLabel'
  let colorInput = document.createElement('input')
  colorInput.className = 'colorName'
  colorInput.type = 'color'
  colorInput.value = color
  let removeButton = document.createElement('button')
  removeButton.innerText = 'Remove'
  removeButton.className = 'removeButton button'
  removeButton.addEventListener('click', ((e) => {
    let tmpElem = document.getElementById(e.target.parentElement.id)
    if (tmpElem && tmpElem.parentElement) {
      tmpElem.parentElement.removeChild(tmpElem)
    }
  }))

  let group = document.createElement('div')
  group.id = 'data' + id
  group.className = 'genreColorGroup'
  group.appendChild(genreInputLabel)
  group.appendChild(genreInput)
  group.appendChild(colorInputLabel)
  group.appendChild(colorInput)
  group.appendChild(removeButton)

  let container = document.getElementById('container')
  container.appendChild(group)
}

const createColorsUI = (data) => {
  let index = 0
  for (let variable in data) {
    if (data.hasOwnProperty(variable)) {
      createColorInput(variable, data[variable], index)
      index++
    }
  }
}

const addOption = () => {
  let index = Math.floor(Math.random() * 1000000)
  createColorInput('misc', '#000000', index)
}

document.getElementById('add').addEventListener('click', addOption);


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
  }, () => {
    let status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 2750);
  });
}

document.getElementById('save').addEventListener('click', saveOptions);



document.addEventListener('DOMContentLoaded', restoreOptions);
