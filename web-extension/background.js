

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {

      chrome.tabs.query({
          currentWindow: true,
          active: true
      }, (tab) => {
          let currentUrl = tab[0].url;

          if (currentUrl.startsWith('https://www.reddit.com/r/listentothis/') || currentUrl === 'https://www.reddit.com/r/listentothis') {
              chrome.tabs.executeScript(tab[0].id, {file: '/colors.js'});
          }
      })

  }
})
