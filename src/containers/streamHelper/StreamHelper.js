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
}