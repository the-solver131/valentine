// Initialize app
let letters = [];
let savedLines = [];
let currentPhoto = null;
let musicPlaying = false;

// Load data from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadLetters();
    loadSavedLines();
    displayLetters();
    displaySavedLines();
});

// Enter site function
function enterSite() {
    document.getElementById('landing-screen').classList.remove('active');
    document.getElementById('main-content').classList.add('active');
}

// Music player
function toggleMusic() {
    const music = document.getElementById('bg-music');
    const button = document.getElementById('music-toggle');
    
    if (musicPlaying) {
        music.pause();
        button.textContent = '🎵 Play Lana';
        musicPlaying = false;
    } else {
        music.play();
        button.textContent = '⏸️ Pause Lana';
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

function saveLetter() {
    const title = document.getElementById('letter-title').value.trim();
    const content = document.getElementById('letter-content').value.trim();
    
    if (!title || !content) {
        alert('Please fill in both title and content!');
        return;
    }
    
    const letter = {
        id: Date.now(),
        title: title,
        content: content,
        photo: currentPhoto,
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    };
    
    letters.unshift(letter);
    saveLetters();
    displayLetters();
    hideLetterForm();
    
    // Show success message
    alert('💕 Letter saved successfully!');
}

function deleteLetter(id) {
    if (confirm('Are you sure you want to delete this letter?')) {
        letters = letters.filter(letter => letter.id !== id);
        saveLetters();
        displayLetters();
    }
}

function displayLetters() {
    const container = document.getElementById('letters-container');
    
    if (letters.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; grid-column: 1/-1;">
                <p style="font-size: 1.5rem; color: var(--brown); font-family: 'Caveat', cursive;">
                    No letters yet. Write your first love letter! 💕
                </p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = letters.map(letter => `
        <div class="letter-card">
            <button class="delete-letter-btn" onclick="deleteLetter(${letter.id})">×</button>
            <h3>${letter.title}</h3>
            <p class="letter-date">${letter.date}</p>
            <p class="letter-text">${letter.content}</p>
            ${letter.photo ? `<img src="${letter.photo}" alt="Letter photo" class="letter-photo">` : ''}
        </div>
    `).join('');
}

function saveLetters() {
    localStorage.setItem('loveLetters', JSON.stringify(letters));
}

function loadLetters() {
    const stored = localStorage.getItem('loveLetters');
    if (stored) {
        letters = JSON.parse(stored);
    }
}

// Nerdy Line Generator
async function generateLine() {
    const topic = document.getElementById('topic-select').value;
    const button = document.querySelector('.generate-btn');
    const lineText = document.getElementById('line-text');
    const copyBtn = document.getElementById('copy-btn');
    
    button.disabled = true;
    button.innerHTML = '<span class="loading"></span> Generating...';
    copyBtn.classList.add('hidden');
    
    try {
        // Call Claude API to generate nerdy romantic line
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                messages: [{
                    role: 'user',
                    content: `Generate one short, creative, nerdy romantic line about ${topic}. Make it clever, sweet, and CS/programming themed. Keep it under 100 characters. Just give me the line, nothing else.`
                }]
            })
        });
        
        const data = await response.json();
        const generatedLine = data.content[0].text.trim();
        
        lineText.textContent = generatedLine;
        copyBtn.classList.remove('hidden');
        
        // Add save button
        if (!document.getElementById('save-line-btn')) {
            const saveBtn = document.createElement('button');
            saveBtn.id = 'save-line-btn';
            saveBtn.className = 'copy-btn';
            saveBtn.textContent = '⭐ Save to Favorites';
            saveBtn.onclick = () => saveLine(generatedLine);
            copyBtn.parentElement.appendChild(saveBtn);
        } else {
            const saveBtn = document.getElementById('save-line-btn');
            saveBtn.onclick = () => saveLine(generatedLine);
        }
        
    } catch (error) {
        // Fallback to predefined lines if API fails
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
            "You're my Stack Overflow answer: exactly what I was looking for."
        ];
        
        const randomLine = fallbackLines[Math.floor(Math.random() * fallbackLines.length)];
        lineText.textContent = randomLine;
        copyBtn.classList.remove('hidden');
    }
    
    button.disabled = false;
    button.innerHTML = 'Generate Line 💕';
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

function saveLine(line) {
    if (!savedLines.includes(line)) {
        savedLines.push(line);
        saveSavedLines();
        displaySavedLines();
        
        const saveBtn = document.getElementById('save-line-btn');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '✓ Saved!';
        setTimeout(() => {
            saveBtn.textContent = originalText;
        }, 2000);
    } else {
        alert('This line is already in your favorites!');
    }
}

function removeLine(index) {
    savedLines.splice(index, 1);
    saveSavedLines();
    displaySavedLines();
}

function displaySavedLines() {
    const container = document.getElementById('saved-lines-container');
    
    if (savedLines.length === 0) {
        container.innerHTML = `
            <p style="text-align: center; color: var(--brown); font-style: italic;">
                No saved lines yet. Generate some nerdy love lines and save your favorites!
            </p>
        `;
        return;
    }
    
    container.innerHTML = savedLines.map((line, index) => `
        <div class="saved-line-card">
            <p class="saved-line-text">${line}</p>
            <button class="remove-line-btn" onclick="removeLine(${index})">×</button>
        </div>
    `).join('');
}

function saveSavedLines() {
    localStorage.setItem('savedLines', JSON.stringify(savedLines));
}

function loadSavedLines() {
    const stored = localStorage.getItem('savedLines');
    if (stored) {
        savedLines = JSON.parse(stored);
    }
}

// Add some example content for first visit
if (letters.length === 0 && !localStorage.getItem('hasVisited')) {
    const exampleLetter = {
        id: Date.now(),
        title: "To My Love 💕",
        content: "Happy Valentine's Day! I built this little corner of the internet just for us. A place where we can write love letters, save our favorite nerdy lines, and listen to Lana together. Thank you for being my constant, my variable that never changes, and the best part of my code. I love you more than words can compile. ❤️",
        photo: null,
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    };
    
    letters.push(exampleLetter);
    saveLetters();
    displayLetters();
    localStorage.setItem('hasVisited', 'true');
}
