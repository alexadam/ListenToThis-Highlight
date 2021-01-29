const favouriteGenres = {
	'ambient': '#fa8335',
	'blues': '#0df9f9',
	'country': '#fad337',
	'chill': '#a8f830',
	'funk': '#F2EF0C',
	'jazz': '#fba19d',
	'soul': '#aca2bb',
}

const getAllPosts = () => {
	// old reddit
	const allPosts = document.getElementsByClassName('thing');
	if (allPosts.length === 0) {
		// new reddit
		return document.getElementsByClassName('scrollerItem');
	}
	return allPosts
}

const getTitle = (post) => {
	// old reddit
	const titleElem = post.querySelector('a.title');
	// new reddit
	if (!titleElem) {
		return post.querySelector('h3');
	}
	return titleElem
}

const getGenresAsString = (titleElem) => {
	const text = titleElem.innerText.toLowerCase()

	// Extract the genres from the title 
	const genresRegex = /\[([^\]]+)\]/g
	const match = genresRegex.exec(text)

	// Skip over posts that are not properly formatted
	if (!match) {
		return null
	}
	return match[0]
}


const getBGColor = (allGenresStr, favGenres) => {
	let bgColor = null
	let favGenresStr = ''

	// Test if the post contains any of our fav. genres
	for (const genre of Object.keys(favGenres)) {
		const genreRegex = new RegExp('.*' + genre + '.*', "i")
		if (!genreRegex.test(allGenresStr)) {
			continue
		}
		bgColor = 'background-color: ' + favGenres[genre] + ' !important'
		favGenresStr += genre + ' '
	}

	return {bgColor, favGenresStr}
}

const changePostColor = (post, bgColor) => {
	post.setAttribute('style', bgColor);
	for (let child of post.children) {
		child.setAttribute('style', bgColor);
		for (let child2 of child.children) {
			child2.setAttribute('style', bgColor);
		}
	}
}

const getSongURL = (titleElem, post) => {
	// old reddit
	let href = titleElem.href
	// new reddit
	if (!href) {
		const extLink = post.querySelector('a.styled-outbound-link')
		if (extLink) {
			return extLink.href
		}
	}
	return href
}

const createSongLink = (titleElem, post, genresText) => {
	post.style.position = 'relative'
	let linkElem = document.createElement('a')
	linkElem.className = "favGenresLink"
	linkElem.style.position = 'absolute'
	linkElem.style.right = '20px'
	linkElem.style.bottom = '0'
	linkElem.style.height = '50px'
	linkElem.style.color = 'black'
	linkElem.style.fontSize = '50px'
	linkElem.style.zIndex = '999999'
	linkElem.innerText = genresText
	linkElem.href = getSongURL(titleElem, post)
	return linkElem
}

const addColorsOnSongs = (colorData) => {
	const allPosts = getAllPosts();

	for (const post of allPosts) {

		// ignore
		let colorObj = post.querySelector('a.favGenresLink');
		if (colorObj) continue //TODO

		const titleElem = getTitle(post)

		if (!titleElem) continue

		const genresStr = getGenresAsString(titleElem)
		const {bgColor, favGenresStr} = getBGColor(genresStr, colorData)

		if (!bgColor) continue

		// Change the post's & its children bg color
		changePostColor(post, bgColor)

		// Create the genres link and add it to the post
		const linkElem = createSongLink(titleElem, post, favGenresStr)
		post.insertAdjacentElement('afterbegin', linkElem)
	}

}

const observeDOM = (() => {
	const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	const eventListenerSupported = window.addEventListener;

	return (obj, callback) => {
		if (MutationObserver) {
			const obs = new MutationObserver((mutations, observer) => {
				if (mutations[0].addedNodes.length)
					callback(mutations[0].addedNodes);
			});
			obs.observe(obj, {
				childList: true,
				subtree: true
			});
		} else if (eventListenerSupported) {
			obj.addEventListener('DOMNodeInserted', callback, false);
			obj.addEventListener('DOMNodeRemoved', callback, false);
		}
	};

})();

// detect if on the new Reddit before the content is loaded
const targetElem = document.getElementById('2x-container')
if (targetElem) {
	observeDOM(targetElem, (addedNodes) => {
		// ignore favGenresLink to avoid an infinite loop
		for (let addedNode of addedNodes) {
			if (addedNode.classList.contains('favGenresLink')) {
				return
			}
		}

		// whenever new content is added
		chrome.storage.local.get('colors', (data) => {
			if (!data || Object.keys(data).length === 0 || Object.keys(data.colors).length === 0) {
					addColorsOnSongs(favouriteGenres);
			} else {
				console.log(data)
					addColorsOnSongs(data.colors);
			}
		});
	});
}

/// before local storage
// addColorsOnSongs(favouriteGenres)
chrome.storage.local.get('colors', (data) => {
	if (!data || Object.keys(data).length === 0 || Object.keys(data.colors).length === 0) {
			addColorsOnSongs(favouriteGenres);
	} else {
		console.log(data)
			addColorsOnSongs(data.colors);
	}
});