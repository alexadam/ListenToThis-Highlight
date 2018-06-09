var styleElem = document.head.appendChild(document.createElement("style"));

styleElem.innerHTML = `
 @import url('https://fonts.googleapis.com/css?family=Oswald');
 @import url('https://fonts.googleapis.com/css?family=Montserrat');
 @import url('https://fonts.googleapis.com/css?family=Teko');
 @import url('https://fonts.googleapis.com/css?family=Kanit');
 @import url('https://fonts.googleapis.com/css?family=Exo');
 @import url('https://fonts.googleapis.com/css?family=Anton');
 @import url('https://fonts.googleapis.com/css?family=Rock+Salt');
 @import url('https://fonts.googleapis.com/css?family=New+Rocker');

.colorGenre
{
    width: 100%;
    height: 100%;
}
`

var elements = document.getElementsByClassName('thing');
// var elements = document.querySelectorAll('a.title');

const genreRegex = /\[(?:([^\]]+)\/?)+\]/gi;

const getGenres = (title) => {
    try {
        title = title.match(genreRegex);
        if (!title) return []
        title = title[0]
        title = title.replace('[', '')
        title = title.replace(']', '')
        let genres = [title]
        genres = title.split(/[\/,]/)

        if (!genres) return []
        genres = genres.filter((gen) => {
                if (gen.length === 0) return false
                return true
            }
        )
        genres = genres.filter((gen, pos) => genres.indexOf(gen) == pos)
        return genres
    } catch (e) {
        console.log(e);
        return []
    }
}

const genreToRegex = (genre) => {
    genre = genre.trim()
    genre = genre.toLowerCase()
    genre = genre.replace(/[^a-z0-9]/gi, '.?')
    genre = '.*?' + genre + '.*?'
    return genre
}

const getGenreColor = (genreRegex, colorData) => {
    for (let key in colorData) {
        let regexKey = genreToRegex(key)
        let re = new RegExp(regexKey, "i");
        if (colorData.hasOwnProperty(key)) {
            if (genreRegex.match(re)) {
                return {genre: key, color: colorData[key]}
            }
        }
    }
    return null
}

const hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const addColorsOnSongs = (colorData) => {
    for (let i = 0; i < elements.length; i++) {
        let elem2 = elements[i];
        let style = window.getComputedStyle(elem2);
        let elem = elem2.querySelector('a.title');
        let text = elem.innerText.toLowerCase()
        let href = elem.href

        if (text.indexOf('[') === -1) {
            continue
        }

        let textParts = text.split('[')
        text = textParts[1]

        let colorContainer = document.createElement('a')
        colorContainer.className = "colorContainer"
        colorContainer.style.float = "right"
        colorContainer.style.marginTop = "15px"
        colorContainer.style.height = style.height
        colorContainer.style.marginBottom = "-" + style.height
        colorContainer.style.display = 'flex'
        colorContainer.style.flexFlow = 'row'
        colorContainer.style.cursor = 'pointer'
        colorContainer.href = href

        let genres = getGenres('[' + text)
        let index = 0
        let outputText = []

        for (let genre of genres) {
            let genreColor = getGenreColor(genre, colorData)

            if (!genreColor){
                continue
            }

            outputText.push(genreColor.genre)

            if (index === 0) {
                let rgb = hexToRgb(genreColor.color)
                elem2.style.backgroundColor = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.3' + ')'
            }
            index++
        }

        outputText = Array.from(new Set(outputText))
        outputText = outputText.join(', ')

        colorContainer.innerText = outputText
        colorContainer.style.maxWidth = '50%'
        colorContainer.style.fontSize = '2vw'
        colorContainer.style.wordWrap = 'normal'
        colorContainer.style.fontFamily = 'Oswald'
        colorContainer.style.fontFamily = 'Montserrat'
        colorContainer.style.fontFamily = 'Teko'
        colorContainer.style.fontFamily = 'Kanit'
        colorContainer.style.fontFamily = 'Exo'
        colorContainer.style.fontFamily = 'Rock Salt'
        colorContainer.style.fontFamily = 'New Rocker'
        colorContainer.style.fontFamily = 'Anton'

        if (genres.length > 0) {
            elem2.insertAdjacentElement('afterbegin', colorContainer)
        }

      }
}

chrome.storage.local.get('colors', function(data) {
    if (!data || Object.keys(data).length === 0 || Object.keys(data.colors).length === 0) {
        addColorsOnSongs({});
    } else {
        addColorsOnSongs(data.colors);
    }
});
