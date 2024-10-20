const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const statusText = document.getElementById('status');

// Initialize webcam
navigator.mediaDevices.getUserMedia({ video: true })
.then((stream) => {
    video.srcObject = stream;
})
.catch((error) => {
    console.error("Error accessing the webcam:", error);
});

// Automatically capture and verify every 3 seconds
setInterval(() => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');

    // Simulate face verification
    statusText.textContent = "Verifying face...";
    verifyFace(dataURL);
}, 3000); // Capture every 3 seconds

function verifyFace(imageData) {
    // Simulate an API call for face verification
    setTimeout(() => {
        const isFaceMatched = Math.random() > 0.5; // Random success/fail for demo purposes
        if (isFaceMatched) {
            statusText.textContent = "Face verified successfully!";
            uploadPhoto(imageData);
        } else {
            statusText.textContent = "Face verification failed. Retrying...";
        }
    }, 1000);
}

function uploadPhoto(imageData) {
    const storageRef = firebase.storage().ref();
    const photoRef = storageRef.child('absensi_photos/' + Date.now() + '.png');

    photoRef.putString(imageData, 'data_url').then(() => {
        console.log('Photo uploaded successfully.');
        statusText.textContent = "Photo uploaded, attendance recorded.";
    }).catch(error => {
        console.error('Error uploading photo:', error);
        statusText.textContent = "Error uploading photo.";
    });
}
