var styleElem = document.head.appendChild(document.createElement("style"));

styleElem.innerHTML = `
.colorGenre
{
    width: 100%;
    height: 100%;
}
.eff {
     position: relative;
}
.eff::after
{
  z-index: -1;
  position: absolute;
  content: "";
  bottom: 15px;
  right: 10px;
  left: auto;
  width: 50%;
  top: 80%;
  max-width:300px;
  background: #777;
  -webkit-box-shadow: 0 15px 10px #777;
  -moz-box-shadow: 0 15px 10px #777;
  box-shadow: 0 15px 10px #777;
  -webkit-transform: rotate(3deg);
  -moz-transform: rotate(3deg);
  -o-transform: rotate(3deg);
  -ms-transform: rotate(3deg);
  transform: rotate(3deg);
}

.effect
{
     position:relative;
    -webkit-box-shadow:0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.21) inset;
    -moz-box-shadow:0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.21) inset;
    box-shadow:0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.21) inset;
}

.effect:before, .effect:after
{
    content:"";
    position:absolute;
    z-index:-1;
    -webkit-box-shadow:0 0 20px rgba(0,0,0,0.8);
    -moz-box-shadow:0 0 20px rgba(0,0,0,0.8);
    box-shadow:0 0 20px rgba(0,0,0,0.8);
    top:10px;
    bottom:10px;
    left:0;
    right:0;
    -moz-border-radius:100px / 10px;
    border-radius:100px / 10px;
}
.effect:after
{
    right:10px;
    left:auto;
    -webkit-transform:skew(8deg) rotate(3deg);
    -moz-transform:skew(8deg) rotate(3deg);
    -ms-transform:skew(8deg) rotate(3deg);
    -o-transform:skew(8deg) rotate(3deg);
    transform:skew(8deg) rotate(3deg);
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
        genres = title.split(/[\/,\s]/)

        if (!genres) return []
        genres = genres.filter((gen) => {
            if (gen.length === 0) return false
            return true
            }
        )
        genres = genres.filter((gen, pos) => genres.indexOf(gen) == pos)
        console.log('GGGG', genres);
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
    let re = new RegExp(genreRegex, "i");
    for (let key in colorData) {
        if (colorData.hasOwnProperty(key)) {
            if (key.match(re)) return colorData[key]
        }
    }
    return '#ffffff'
}

// const genColors = (nrOfColors) => {
//     let colors = []
//     for(let i = 0; i < 360; i += 360 / nrOfColors) {
//         let hue = i;
//         let saturation = 90 + Math.random() * 10;
//         let lightness = 50 + Math.random() * 10;
//
//         // let rgb = hslToRgb(hue, saturation, lightness)
//         // let hex = rgbToHex(rgb[0], rgb[1], rgb[2])
//         let hex = hslToHex(hue, saturation, lightness)
//         colors.push(hex)
//     }
//     console.log(colors);
//     return colors
// }
//
// function hslToHex(h, s, l) {
//   h /= 360;
//   s /= 100;
//   l /= 100;
//   let r, g, b;
//   if (s === 0) {
//     r = g = b = l; // achromatic
//   } else {
//     const hue2rgb = (p, q, t) => {
//       if (t < 0) t += 1;
//       if (t > 1) t -= 1;
//       if (t < 1 / 6) return p + (q - p) * 6 * t;
//       if (t < 1 / 2) return q;
//       if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
//       return p;
//     };
//     const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
//     const p = 2 * l - q;
//     r = hue2rgb(p, q, h + 1 / 3);
//     g = hue2rgb(p, q, h);
//     b = hue2rgb(p, q, h - 1 / 3);
//   }
//   const toHex = x => {
//     const hex = Math.round(x * 255).toString(16);
//     return hex.length === 1 ? '0' + hex : hex;
//   };
//   return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
// }
//
//
// const getRandomInt = () => Math.floor(255 * Math.random())
//
// const getRandomColor = (opacity = 0.1) => {
//     return 'rgba(' + getRandomInt() + ',' + getRandomInt() + ',' + getRandomInt() + ',' + opacity + ')'
// }

const addColorsOnSongs = (colorData) => {
    for (let i = 0; i < elements.length; i++) {
        let elem2 = elements[i];
        var style = window.getComputedStyle(elem2);
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
        colorContainer.style.width = "200px"
        colorContainer.style.height = style.height
        colorContainer.style.marginBottom = "-" + style.height
        colorContainer.style.display = 'flex'
        colorContainer.style.flexFlow = 'row'
        colorContainer.style.cursor = 'pointer'
        colorContainer.href = href

        let genres = getGenres('[' + text)

        for (let genre of genres) {
            let genreRegex = genreToRegex(genre)
            let genreColor = getGenreColor(genreRegex, colorData)

            if (genreColor === '#ffffff'){
                continue
            }

            let colorElem = document.createElement('div')
            colorElem.className = "colorGenre effect"

            colorElem.style.backgroundColor = genreColor

            colorContainer.appendChild(colorElem)
        }

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
