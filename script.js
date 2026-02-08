// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAEgXPl5-whaLveBqDvKUcTWSxz0g1-5GI",
    authDomain: "valentine2026-4f7de.firebaseapp.com",
    databaseURL: "https://valentine2026-4f7de-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "valentine2026-4f7de",
    storageBucket: "valentine2026-4f7de.firebasestorage.app",
    messagingSenderId: "744652429290",
    appId: "1:744652429290:web:ce45d6f1bd8cb7c1a84493"
};

// Initialize app
let database;
let currentRoomKey = null;
let currentPhoto = null;
let musicPlaying = false;

// Check if Firebase config is set
function isFirebaseConfigured() {
    return firebaseConfig.apiKey !== "YOUR_API_KEY";
}

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
    if (isFirebaseConfigured()) {
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
    }
    
    // Check if user already has a room key
    const storedKey = localStorage.getItem('roomKey');
    if (storedKey && isFirebaseConfigured()) {
        currentRoomKey = storedKey;
        showLanding();
    }
});

// Password/Room functions
function enterRoom() {
    const password = document.getElementById('room-password').value.trim();
    
    if (!password) {
        alert('Please enter a password!');
        return;
    }
    
    if (!isFirebaseConfigured()) {
        alert('⚠️ Firebase not configured! Please follow the setup instructions in README.md to enable shared letters.');
        // For demo purposes, still allow entering with localStorage
        currentRoomKey = 'demo-' + btoa(password);
        localStorage.setItem('roomKey', currentRoomKey);
        showLanding();
        return;
    }
    
    // Create a hash of the password to use as room key
    currentRoomKey = btoa(password); // Simple base64 encoding (you can use better hashing in production)
    localStorage.setItem('roomKey', currentRoomKey);
    
    showLanding();
}

function showLanding() {
    document.getElementById('password-screen').classList.remove('active');
    document.getElementById('landing-screen').classList.add('active');
    
    // Load letters if Firebase is configured
    if (isFirebaseConfigured()) {
        loadLettersFromFirebase();
    }
}

function enterSite() {
    document.getElementById('landing-screen').classList.remove('active');
    document.getElementById('main-content').classList.add('active');
    
    if (isFirebaseConfigured()) {
        loadLettersFromFirebase();
    } else {
        // Fallback to localStorage
        displayNoFirebaseMessage();
    }
}

function logout() {
    if (confirm('Are you sure you want to logout? You\'ll need to re-enter your room password.')) {
        localStorage.removeItem('roomKey');
        currentRoomKey = null;
        location.reload();
    }
}

function displayNoFirebaseMessage() {
    const container = document.getElementById('letters-container');
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: #fff3cd; border-radius: 15px; border: 2px solid #ffc107;">
            <h3 style="color: #856404; margin-bottom: 1rem; font-family: 'Caveat', cursive; font-size: 2rem;">
                ⚠️ Firebase Not Configured
            </h3>
            <p style="color: #856404; font-size: 1.1rem; margin-bottom: 1rem;">
                To enable shared letters between you and your partner, you need to set up Firebase.
            </p>
            <p style="color: #856404; font-size: 1rem;">
                Please follow the instructions in the README.md file to configure Firebase.
                Without Firebase, letters will only be stored locally on this device.
            </p>
        </div>
    `;
}

// Firebase Functions
function loadLettersFromFirebase() {
    if (!isFirebaseConfigured() || !currentRoomKey) return;
    
    const lettersRef = database.ref('rooms/' + currentRoomKey + '/letters');
    
    lettersRef.on('value', (snapshot) => {
        const container = document.getElementById('letters-container');
        const data = snapshot.val();
        
        if (!data) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; grid-column: 1/-1;">
                    <p style="font-size: 1.5rem; color: var(--brown); font-family: 'Caveat', cursive;">
                        No letters yet. Write your first love letter! 💕
                    </p>
                </div>
            `;
            return;
        }
        
        // Convert object to array and sort by date
        const letters = Object.entries(data).map(([id, letter]) => ({
            id,
            ...letter
        })).sort((a, b) => b.timestamp - a.timestamp);
        
        displayLetters(letters);
    });
}

function saveLetter() {
    const title = document.getElementById('letter-title').value.trim();
    const content = document.getElementById('letter-content').value.trim();
    
    if (!title || !content) {
        alert('Please fill in both title and content!');
        return;
    }
    
    const letter = {
        title: title,
        content: content,
        photo: currentPhoto,
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        timestamp: Date.now()
    };
    
    if (isFirebaseConfigured() && currentRoomKey) {
        // Save to Firebase
        const lettersRef = database.ref('rooms/' + currentRoomKey + '/letters');
        lettersRef.push(letter);
        
        hideLetterForm();
        alert('💕 Letter saved successfully!');
    } else {
        // Fallback message
        alert('⚠️ Firebase not configured. Letter cannot be saved to shared space. Please configure Firebase following README.md instructions.');
        hideLetterForm();
    }
}

function deleteLetter(id) {
    if (!isFirebaseConfigured() || !currentRoomKey) return;
    
    if (confirm('Are you sure you want to delete this letter?')) {
        const letterRef = database.ref('rooms/' + currentRoomKey + '/letters/' + id);
        letterRef.remove();
    }
}

function displayLetters(letters) {
    const container = document.getElementById('letters-container');
    
    container.innerHTML = letters.map(letter => `
        <div class="letter-card">
            <button class="delete-letter-btn" onclick="deleteLetter('${letter.id}')">×</button>
            <h3>${letter.title}</h3>
            <p class="letter-date">${letter.date}</p>
            <p class="letter-text">${letter.content}</p>
            ${letter.photo ? `<img src="${letter.photo}" alt="Letter photo" class="letter-photo">` : ''}
        </div>
    `).join('');
}

// Music player
function toggleMusic() {
    const music = document.getElementById('bg-music');
    const button = document.getElementById('music-toggle');
    
    if (musicPlaying) {
        music.pause();
        button.textContent = '🎵 Play Music';
        musicPlaying = false;
    } else {
        music.play();
        button.textContent = '⏸️ Pause Music';
        musicPlaying = true;
    }
}

// Tab navigation
function showTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${tabName}-section`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Letter Form Functions
function showLetterForm() {
    document.getElementById('letter-form').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideLetterForm() {
    document.getElementById('letter-form').classList.add('hidden');
    document.getElementById('letter-title').value = '';
    document.getElementById('letter-content').value = '';
    document.getElementById('photo-preview').innerHTML = '';
    currentPhoto = null;
}

function previewPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentPhoto = e.target.result;
            document.getElementById('photo-preview').innerHTML = `
                <img src="${currentPhoto}" alt="Preview" style="max-width: 300px; border-radius: 10px;">
            `;
        };
        reader.readAsDataURL(file);
    }
}

// Nerdy Line Generator
function generateLine() {
    const fallbackLines = [
        "You're the semicolon to my statement; incomplete without you.",
        "If love were code, you'd be my main function.",
        "You must be a compiler, because you turn my thoughts into reality.",
        "Our love is like recursion: it goes deeper every time.",
        "You're the algorithm to my heart; always finding the optimal solution.",
        "Like a perfectly optimized query, you make my heart run faster.",
        "You're my favorite variable: constant, never null, always there.",
        "If (me + you) { return happiness; }",
        "You're the CSS to my HTML; you make everything beautiful.",
        "Our connection is better than any API integration.",
        "You're like machine learning: you make me better every day.",
        "In the database of my heart, you're the primary key.",
        "You're my try-catch block; you handle all my exceptions.",
        "Like a binary search, you always find the way to my heart.",
        "You're my Stack Overflow answer: exactly what I was looking for.",
        "My love for you is O(1): constant and never-changing.",
        "You're the commit I never want to revert.",
        "Like a well-written loop, my love for you is infinite.",
        "You're my favorite merge: no conflicts, just harmony.",
        "In the array of life, you're my first element.",
        "You debug my heart every single day.",
        "Our love compiles perfectly every time.",
        "You're the return value I've always been searching for.",
        "Like a perfect hash function, you complete me.",
        "You're my sudo command: you have all the permissions to my heart."
    ];
    
    const button = document.querySelector('.generate-btn');
    const lineText = document.getElementById('line-text');
    const copyBtn = document.getElementById('copy-btn');
    
    button.disabled = true;
    button.innerHTML = '<span class="loading"></span> Generating...';
    copyBtn.classList.add('hidden');
    
    // Simulate generation delay
    setTimeout(() => {
        const randomLine = fallbackLines[Math.floor(Math.random() * fallbackLines.length)];
        lineText.textContent = randomLine;
        copyBtn.classList.remove('hidden');
        
        button.disabled = false;
        button.innerHTML = 'Generate Line 💕';
    }, 1000);
}

function copyLine() {
    const lineText = document.getElementById('line-text').textContent;
    navigator.clipboard.writeText(lineText).then(() => {
        const copyBtn = document.getElementById('copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });
}
