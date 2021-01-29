chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {

        chrome.tabs.query({
            currentWindow: true,
            active: true
        }, (tab) => {
            let currentUrl = tab[0].url;

            if (currentUrl.startsWith('https://www.reddit.com/r/listentothis/')
                || currentUrl === 'https://www.reddit.com/r/listentothis'
                || currentUrl.startsWith('https://old.reddit.com/r/listentothis/')
                || currentUrl === 'https://old.reddit.com/r/listentothis'
                ) {
                chrome.tabs.executeScript(tab[0].id, {
                    file: '/colors.js'
                });
            }
        })

    }
})

const genres = {
    'ambient': '#fa8335',
    'blues': '#0df9f9',
    'country': '#fad337',
    'chill': '#a8f830',
    'funk': '#F2EF0C',
    'jazz': '#fba19d',
    'soul': '#aca2bb',
}

chrome.storage.local.get('colors', function(data) {
    if (!data || Object.keys(data).length === 0 || Object.keys(data.colors).length === 0) {
        chrome.storage.local.set({
            colors: genres
        });
    }
});
