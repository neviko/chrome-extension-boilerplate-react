import React, { useEffect, useState, useRef } from 'react';
import { getStream } from '../../containers/streamHelper/StreamHelper';


let streamRef = null

const Popup = () => {
  const [curPose, setCurPose] = useState("Default");

  useEffect(() => {
    // console.log('popup opened')
    // console.log('audioRef.current is:', audioRef.current)
    const audio = new Audio(chrome.runtime.getURL('beep.wav'))
    audio.crossOrigin = 'anonymous';
    audio.loop = true;
    audio.play()
    return () => {

    }
  }, [])

  const setupListeners = _ => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.type) {
        case 'posenet-score':
          setCurPose(message.data[0].pose.score)
          console.log("result from background : ", message.data[0])
          // sendResponse({ response: 'get-result' })
          break;
        default:
          break;
      }
      return true

    })
  }
  setupListeners()
  // const [stream, setStream] = useState(null)






  const requestCreateStream = async _ => {

    try {
      // const stream = await getStream()
      // streamRef = stream
      // console.log('stream is on in popup:', stream)
      // document.querySelector('#webcamVideo').srcObject = stream

      chrome.runtime.sendMessage({ type: 'start-stream' },
        (response) => {
          console.log('content type response', response.response)
          return true
        })
    }

    catch (err) {
      console.error(err);

    }
  }

  const requestDestroyStream = _ => {
    // streamRef.getTracks().forEach(function (track) {
    //   if (track.readyState === 'live' && track.kind === 'video') {
    //     track.stop();
    //   }
    // })
    chrome.runtime.sendMessage({ type: 'stop-stream' },
      (response) => {
        console.log('content type response', response.response)
        return true
      })
  }



  return (
    <div>
      <div>
        in the popup
      </div>
      {/* <audio ref={audioRef} ></audio> */}
      <div className="buttons-container">
        <button id="openStream" onClick={requestCreateStream} >Open stream </button>
        <button id="closeStream" onClick={requestDestroyStream} >Close stream</button>
      </div>
      {/* <div>
        <video autoPlay={true} id="webcamVideo" width="227px" height="227px"></video>
      </div> */}
      <div>
        {curPose}
      </div>
    </div>


  );
};


export default Popup;
