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
        if (title.indexOf('/') !== -1) {
            genres = title.split('/')
        } else if (title.indexOf(',') !== -1) {
            genres = title.split(',')
        }
        if (!genres) return []
        return genres
    } catch (e) {
        console.log(e);
        return []
    }
}

const genColors = (nrOfColors) => {
    let colors = []
    for(let i = 0; i < 360; i += 360 / nrOfColors) {
        let hue = i;
        let saturation = 90 + Math.random() * 10;
        let lightness = 50 + Math.random() * 10;

        // let rgb = hslToRgb(hue, saturation, lightness)
        // let hex = rgbToHex(rgb[0], rgb[1], rgb[2])
        let hex = hslToHex(hue, saturation, lightness)
        colors.push(hex)
    }
    console.log(colors);
    return colors
}

function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
    colorContainer.style.float = "right"
    colorContainer.style.width = "200px"
    colorContainer.style.height = style.height
    colorContainer.style.marginBottom = "-" + style.height
    colorContainer.style.display = 'flex'
    colorContainer.style.flexFlow = 'row'
    // colorContainer.style.position = 'absolute'
    // colorContainer.style.zIndex = '-9999'

    let allColors = genColors(30)
    console.log(allColors);

    let genres = getGenres('[' + text)

    for (let genre of genres) {
        let colorElem = document.createElement('div')
        colorElem.className = "colorGenre effect"
        // colorElem.style.width = "100%"
        // colorElem.style.height = '100%'
        // colorElem.style.position = 'absolute'
        // colorElem.style.marginTop = "-" + style.height
        // colorElem.style.zIndex = '-9999'

        colorElem.style.backgroundColor = allColors[Math.floor(Math.random()*allColors.length)]
        if (genre.indexOf('jazz') !== -1) {
            colorElem.style.backgroundColor = 'yellow'
        }
        if (genre.indexOf('rock') !== -1) {
            colorElem.style.backgroundColor = allColors[Math.floor(Math.random()*allColors.length)]
        }

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

  const genres = {

      'afrobeat': '',
      'alternative': '',
      'ambient': '',
      'bluegrass': '',
      'blues': '',
      'classical': '',
      'country': '',
      'chill': '',
      'dnb': '',
      'dubstep': '',
      'electronic': '',
      'electro': '',
      'experimental': '',
      'emo': '',
      'folk': '',
      'funk': '',
      'garage': '',
      'hardcore': '',
      'hiphop': '',
      'house': '',
      'indie': '',
      'instrumental': '',
      'jazz': '',
      'lofi': '',
      'metal': '',
      'orchestral': '',
      'piano': '',
      'pop': '',
      'post': '',
      'prog': '',
      'punk': '',
      'psychedelic': '',
      'rnb': '',
      'rock': '',
      'soul': '',
      'surf': '',
      'swing': '',
      'trap': '',
      'vintage': '',
      'world': '',
  }
