const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const statusText = document.getElementById('status');
const loadingDiv = document.getElementById('loading');

// Initialize webcam
navigator.mediaDevices.getUserMedia({ video: true })
.then((stream) => {
    video.srcObject = stream;
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

    // Tampilkan loading
    loadingDiv.style.display = 'flex';
    statusText.style.opacity = '0'; // Sembunyikan status text

    verifyFace(dataURL);
}

// Simulasi verifikasi wajah
function verifyFace(imageData) {
    setTimeout(() => {
        loadingDiv.style.display = 'none'; // Sembunyikan loading
        const isFaceMatched = Math.random() > 0.5; // Random success/fail for demo purposes
        
        if (isFaceMatched) {
            statusText.textContent = "Face verified successfully!";
            statusText.className = 'success';
            statusText.style.opacity = '1'; // Tampilkan status text
            uploadPhoto(imageData);
        } else {
            statusText.textContent = "Face verification failed. Retrying...";
            statusText.className = 'error';
            statusText.style.opacity = '1'; // Tampilkan status text
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
        statusText.className = 'success';
    }).catch(error => {
        console.error('Error uploading photo:', error);
        statusText.textContent = "Error uploading photo.";
        statusText.className = 'error';
    });
}
