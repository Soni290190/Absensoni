// Firebase configuration
const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "PROJECT_ID.firebaseapp.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID",
    measurementId: "G-MEASUREMENT_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const absensiForm = document.getElementById('absensiForm');
const loadingIndicator = document.getElementById('loading');
const absensiList = document.getElementById('absensiList');

absensiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loadingIndicator.style.display = 'block'; // Tampilkan loading
    const name = document.getElementById('name').value;
    const time = document.getElementById('time').value;

    db.collection('absensi').add({
        name: name,
        time: time,
        date: new Date().toLocaleDateString()
    }).then(() => {
        alert('Absensi Berhasil!');
        loadingIndicator.style.display = 'none'; // Sembunyikan loading
        absensiForm.reset();
    }).catch(error => {
        console.error('Error:', error);
        loadingIndicator.style.display = 'none'; // Sembunyikan loading
    });
});

db.collection('absensi').onSnapshot((snapshot) => {
    absensiList.innerHTML = '';
    snapshot.forEach((doc, index) => {
        const absensi = doc.data();
        const li = document.createElement('li');
        li.innerHTML = `${absensi.name} - ${absensi.time} (${absensi.date})`;
        absensiList.appendChild(li);

        // Tambahkan delay untuk efek animasi
        setTimeout(() => {
            li.classList.add('show');
        }, index * 100); // Setiap item muncul dengan jeda 100ms
    });
});
