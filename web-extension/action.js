
document.getElementById('openOptions').addEventListener('click', (e) => {
  let optionsUrl = chrome.extension.getURL("./options.html");
  chrome.tabs.create({
    url: optionsUrl
  });
})
