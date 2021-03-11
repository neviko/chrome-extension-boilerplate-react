const STREAM_CONSTRAINTS = {
    video: true
}

export const getStream = async _ => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(STREAM_CONSTRAINTS)
        return stream
    }

    catch (err) {
        console.error(err);
        return null
    }
}


export const stopStream = streamRef => {
    streamRef.getTracks().forEach(function (track) {
        if (track.kind === 'video') {
            track.stop();
        }
    });
    streamRef = null
}

export const isCameraPermissionGranted = _ => {
    try {
        chrome.storage.local.get('camAccess', items => {
            if (!!items['camAccess']) {
                console.log('cam access already exists');
                return true
            }
            else {
                console.log("new tab open")
                return false
            }
        });
    }
    catch (err) {
        console.log('error while getting data from storage: camAccess', err)
        return null
    }
}