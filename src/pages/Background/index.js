import '../../assets/img/icon-34.png'
import '../../assets/img/icon-128.png'
import { initPoseLibrary, getFramePoses } from '../../containers/PoseLibrary/PoseLibrary'
import {
    getStream,
    stopStream,
    isCameraPermissionGranted
} from '../../containers/streamHelper/StreamHelper'

console.log('This is the background page.')
let videoElm = null
let poseNetInterval = null
let streamRef = null


// myAudio.crossOrigin = "anonymous"
// setTimeout(() => {
// myAudio.play()
// }, 2000);



const openNewTab = _ => {

    const newTab = chrome.runtime.getURL('Newtab.html')
    chrome.tabs.create(
        {
            url: newTab,
            active: true
        },
        data => {
            console.log(data)
        }
    )
}

const setupStream = async _ => {
    try {
        if (streamRef) {
            return
        }
        const stream = await getStream()
        streamRef = stream
        console.log('stream is:', stream);
        videoElm.srcObject = stream;
    }

    catch (err) {
        console.error(err);
    }
}

const stopVideoOnly = () => {
    if (!streamRef) {
        return
    }
    stopStream(streamRef)
    streamRef = null
}

const startReceivingPoses = _ => {

    const src = chrome.runtime.getURL('beep.wav')
    const myAudio = document.querySelector('audio')// new Audio(src)
    myAudio.crossOrigin = 'anonymous';
    myAudio.loop = true;
    myAudio.src = src
    myAudio.play()
    poseNetInterval = setInterval(async () => {
        try {
            const poses = await getFramePoses()
            console.log(poses)

            chrome.runtime.sendMessage({ type: 'posenet-score', data: poses })
            console.log('results is:', poses);
        }

        catch (err) {
            console.log('error while getting poses', err);
        }
    }, 250);

}

const stopReceivingPoses = _ => {
    clearInterval(poseNetInterval)
}



const setupListeners = _ => {
    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        switch (message.type) {
            case 'start-stream':
                await setupStream()
                initPoseLibrary({ videoElm: videoElm })
                startReceivingPoses()
                sendResponse({ stream: streamRef, response: 'stream-started' })
                break

            case 'stop-stream':
                await stopVideoOnly()
                stopReceivingPoses()
                sendResponse({ response: 'stream-ended' })

                break

            default:
                break;
        }
        return true

    })
}


const init = _ => {
    setupListeners()
    videoElm = document.querySelector('#webcamVideoBg')
    if (!isCameraPermissionGranted()) {
        openNewTab()
    }
}


init()



