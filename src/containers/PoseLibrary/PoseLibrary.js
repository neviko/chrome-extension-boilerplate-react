
import ml5 from 'ml5'

let poseNet = null
let videoElm = null
const poseNet_options = {
    input_resolution: 720,
    outputStride: 16,
    maxPoseDetections: 2,
    multiplier: 0.50,
    detectionType: 'multiple'
}

const setupPosesLibrary = _ => {
    if (!poseNet) {
        poseNet = ml5.poseNet(getFramePoses.bind(this), poseNet_options)
    }
}

export const initPoseLibrary = (options) => {
    videoElm = options.videoElm
    setupPosesLibrary()
}

export const getFramePoses = async () => {
    try {
        const poses = await poseNet.multiPose(videoElm)
        return poses
    }

    catch (err) {
        console.log('error while getting poses', err);
        return null
    }
}



