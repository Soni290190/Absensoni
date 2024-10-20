const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const statusText = document.getElementById('status');

// Initialize webcam
navigator.mediaDevices.getUserMedia({ video: true })
.then((stream) => {
    video.srcObject = stream;

    // Mulai proses capture otomatis ketika video sudah bisa diputar
    video.addEventListener('loadeddata', () => {
        startAutoCapture();  // Mulai capture otomatis setelah webcam aktif
    });
})
.catch((error) => {
    console.error("Error accessing the webcam:", error);
    statusText.textContent = "Error accessing the webcam. Please allow camera access.";
});

// Function untuk memulai capture otomatis
function startAutoCapture() {
    statusText.textContent = "Capturing and verifying face every 3 seconds...";

    // Automatically capture and verify every 3 seconds
    setInterval(() => {
        captureAndVerify();
    }, 3000); // Capture every 3 seconds
}

// Function untuk menangkap gambar dan verifikasi
function captureAndVerify() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');

    // Simulate face verification
    statusText.textContent = "Verifying face...";
    verifyFace(dataURL);
}

// Simulasi verifikasi wajah
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

// Upload foto ke Firebase Storage
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
