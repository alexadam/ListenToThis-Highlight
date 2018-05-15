

var elements = document.getElementsByClassName('thing');
// var elements = document.querySelectorAll('a.title');

const genreRegex = /\[(?:([^\/\]]+)\/?)+\]/gi;


const getGenres = (title) => {
    try {
        title = title.match(genreRegex);
        if (!title) return []
        title = title[0];
        if (!title) return []
        title = title.replace('[', '')
        title = title.replace(']', '')
        let genres = title.split('/')
        if (!genres) return []
        return genres
    } catch (e) {
        return []
    }

    // return []
}

const getRandomInt = () => Math.floor(255 * Math.random())

const getRandomColor = (opacity = 0.1) => {
    return 'rgba(' + getRandomInt() + ',' + getRandomInt() + ',' + getRandomInt() + ',' + opacity + ')'
}


for (let i = 0; i < elements.length; i++) {
    let elem2 = elements[i];
    var style = window.getComputedStyle(elem2);
    let elem = elem2.querySelector('a.title');
    let text = elem.innerText.toLowerCase()

    if (text.indexOf('[') === -1) {
        continue
    }

    let textParts = text.split('[')
    text = textParts[1]

    let colorContainer = document.createElement('div')
    colorContainer.className = "colorContainer"
    colorContainer.style.width = "100%"
    colorContainer.style.height = style.height
    colorContainer.style.marginBottom = "-" + style.height
    colorContainer.style.display = 'flex'
    colorContainer.style.flexFlow = 'row'
    // colorContainer.style.position = 'absolute'
    // colorContainer.style.zIndex = '-9999'

    let genres = getGenres('[' + text)

    for (let genre of genres) {
        console.log(genre);
        let colorElem = document.createElement('div')
        colorElem.style.width = "100%"
        colorElem.style.height = '100%'
        // colorElem.style.position = 'absolute'
        // colorElem.style.marginTop = "-" + style.height
        // colorElem.style.zIndex = '-9999'

        if (genre.indexOf('jazz') !== -1) {
            colorElem.style.backgroundColor = 'yellow'
        }
        if (genre.indexOf('rock') !== -1) {
            colorElem.style.backgroundColor = getRandomColor()
        }
        colorElem.style.backgroundColor = getRandomColor(0.25)

        colorContainer.appendChild(colorElem)
    }


    // elem2.prependChild(colorContainer)
    if (genres.length > 0) {
        elem2.insertAdjacentElement('afterbegin', colorContainer)
    }

    // if (text.indexOf('jazz') !== -1) {
    //     console.log(text);
    //     colorContainer.style.backgroundColor = 'yellow'
    // }
    // if (text.indexOf('rock') !== -1) {
    //     colorContainer.style.backgroundColor = 'green'
    // }

    // elem.style.backgroundColor = 'red'

    //  var eachtext1 = text1[i].innerText;
    // var firstText1 = eachtext1.substr(0, 20);
  }
