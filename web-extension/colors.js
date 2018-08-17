const styleElem = document.head.appendChild(document.createElement("style"));

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

// old reddit
const elements = document.getElementsByClassName('thing');
const elements2 = document.getElementsByClassName('scrollerItem');


/*

// TODO on ajax page update !!!! see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
// for new reddit design
var elementsNew = document.querySelectorAll('span > a > h2');
elementsNew.forEach((elem) => console.log(elem.innerText))
// TODO ? is this the best way /
var elementsNew2 = document.querySelectorAll('span > a[target="_blank"]');
elementsNew2.forEach((elem) => console.log(elem.innerText))

*/

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
    genre = '.*' + genre + '.*'
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
    let allElements = elements
    if (elements.length === 0) allElements = elements2;

    for (let i = 0; i < allElements.length; i++) {
        let elem2 = allElements[i];
        let style = window.getComputedStyle(elem2);
        let colorObj = elem2.querySelector('div.colorContainer');
        if (colorObj) continue //TODO


        // old reddit
        let elem = elem2.querySelector('a.title');
        // new reddit
        if (!elem) {
            elem = elem2.querySelector('h2');
        }
        if (!elem) continue

        let text = elem.innerText.toLowerCase()
        let href = elem.href
        // new reddit
        if (!href) {
            hrefs = elem2.getElementsByTagName('a')
            for (let tmpHref of hrefs) {
                if (tmpHref.rel === 'noopener noreferrer') {
                    href = tmpHref.href
                    break
                }
            }
        }

        if (text.indexOf('[') === -1) {
            continue
        }

        let textParts = text.split('[')
        text = textParts[1]

        let colorContainer = document.createElement('a')
        colorContainer.className = "colorContainer"
        colorContainer.style.float = "right"

        // determine marginTop
        let marginTop = '15px'
        if (elem2.offsetHeight < 50) {marginTop = '6px'}
        else if (elem2.offsetHeight < 85){ marginTop = '20px'}

        colorContainer.style.marginTop = marginTop
        colorContainer.style.height = style.height
        colorContainer.style.marginBottom = "-" + style.height
        colorContainer.style.cursor = 'pointer'
        colorContainer.style.color = 'black'
        colorContainer.href = href

        let genres = getGenres('[' + text)
        let index = 0
        let outputText = []
        let backgroundColor = null

        for (let genre of genres) {
            let genreColor = getGenreColor(genre, colorData)

            if (!genreColor){
                continue
            }

            outputText.push(genreColor.genre)

            if (index === 0) {
                let rgb = hexToRgb(genreColor.color)
                backgroundColor = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 1' + ')'
                elem2.style.backgroundColor = backgroundColor
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

        // on new reddit - set uniform color
        if (backgroundColor) {
            for (let child of elem2.children) {
                child.setAttribute('style', 'background-color: '+backgroundColor+' !important' );

                for (let child2 of child.children) {
                    child2.setAttribute('style', 'background-color: '+backgroundColor+' !important' );
                }
            }
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



// const targetElem = document.getElementsByClassName('s1jtt59r-5 kRzhyR')[0];
// console.log('taget', targetElem, targetElem.style.cssText);

const targetElem = document.getElementById('SHORTCUT_FOCUSABLE_DIV')


// TODO Remove
// var observer = new MutationObserver(() => {console.log('UPDATE 1222 !!!!!')});
// observer.observe(targetElem, { attributes: true, childList: true, subtree: true });
// document.body.addEventListener('DOMSubtreeModified', function () {
// document.title = 'DOM Changed at ' + new Date();
// }, false);



var observeDOM = (function(){
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            var obs = new MutationObserver(function(mutations, observer){
                // if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                if( mutations[0].addedNodes.length)
                    callback(mutations[0].addedNodes);
            });
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            // obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    };

})();

// only on new reddit
if (targetElem) {
    observeDOM(targetElem, function(addedNodes) {
        for (let addedNode of addedNodes) {
            if (addedNode.className === 'colorContainer') {
                return
            }
        }

        chrome.storage.local.get('colors', function(data) {
            let paras = document.getElementsByClassName('colorContainer');
            while (paras[0]) {
                paras[0].parentNode.removeChild(paras[0]);
            }

            if (!data || Object.keys(data).length === 0 || Object.keys(data.colors).length === 0) {
                addColorsOnSongs({});
            } else {
                addColorsOnSongs(data.colors);
            }
        });
    });
}
