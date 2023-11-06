let mediaRecorder;
let recordedBlobs;

function startRecording(video) {
    recordedBlobs = [];
    let options = { mimeType: 'video/webm' };

    let stream;
    if (video.captureStream) {
        stream = video.captureStream();
    } else if (video.mozCaptureStream) {
        stream = video.mozCaptureStream();
    } else if (video.webkitCaptureStream) {
        stream = video.webkitCaptureStream();
    } else {
        console.error('Stream capture is not supported');
        alert('Stream capture is not supported in this browser.');
        return;
    }

    try {
        mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        return;
    }

    mediaRecorder.onstop = (event) => {
        console.log('Recorder stopped:', event);
        console.log('Recorded Blobs:', recordedBlobs);
        let recordedBlob = new Blob(recordedBlobs, { type: 'video/webm' });
        let url = window.URL.createObjectURL(recordedBlob);
        let a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'recordedVideo.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    };

    mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    };

    mediaRecorder.start(100); // collect 100ms of data
    console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
    mediaRecorder.stop();
}