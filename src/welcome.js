import { getStream } from './containers/streamHelper/StreamHelper'

const displayMessage = (message) => {
  document.querySelector('#status').innerHTML = message
}

(async _ => {
  try {
    const stream = await getStream
    if (stream) {
      displayMessage('Webcam access granted for extension, please close this tab') :
    }

    else {
      displayMessage('Error getting webcam access for extension: ')
      chrome.storage.local.set({
        'camAccess': true
      }, () => { });
    }
  }

  catch (err) {
    displayMessage('Error getting webcam access for extension: ')
    console.error(err);
  }
})()

