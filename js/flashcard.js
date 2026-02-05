// DOM Elements
const flashcardElement = document.getElementById('flashcard');
const frontContent = document.getElementById('front-content');
const backKanji = document.getElementById('back-kanji');
const backFurigana = document.getElementById('back-furigana');
const backMeaning = document.getElementById('back-meaning');
const backId = document.getElementById('back-id');
const categoryName = document.getElementById('category-name');

const answerInput = document.getElementById('answer-input');
const checkButton = document.getElementById('check-button');
const hintButton = document.getElementById('hint-button');
const nextButton = document.getElementById('next-button');

const feedbackElement = document.getElementById('feedback');
const feedbackText = document.getElementById('feedback-text');
const hintDisplay = document.getElementById('hint-display');
const hintContent = document.getElementById('hint-content');

// Score and progress elements
const scoreDisplay = document.getElementById('score');
const currentCardSpan = document.getElementById('current-card');
const totalCardsSpan = document.getElementById('total-cards');
const correctCountSpan = document.getElementById('correct-count');
const incorrectCountSpan = document.getElementById('incorrect-count');

// Setup elements
const flashcardSetupContainer = document.getElementById('flashcard-setup-container');
const questionCountInput = document.getElementById('flashcard-question-count');
const startFlashcardGameBtn = document.getElementById('start-quiz-btn');
const flashcardGameWrapper = document.getElementById('flashcard-game-wrapper');
const quickButtons = document.querySelectorAll('.quick-btn');

// Category elements
const categoriesGrid = document.getElementById('categories-grid');
const selectAllCategoriesBtn = document.getElementById('select-all-categories');
const deselectAllCategoriesBtn = document.getElementById('deselect-all-categories');

// Results elements
const resultsContainer = document.getElementById('results-container');
const resultTotal = document.getElementById('result-total');
const resultCorrect = document.getElementById('result-correct');
const resultIncorrect = document.getElementById('result-incorrect');
const resultScore = document.getElementById('result-score');
const resultAccuracy = document.getElementById('result-accuracy');
const restartSessionBtn = document.getElementById('restart-session-btn');
const backToHomeBtn = document.getElementById('back-to-home-btn');
const endSessionBtn = document.getElementById('end-session-btn');

// Game variables
let vocabulary = [];
let allVocabularyData = [];
let selectedCategories = [];
let currentCardIndex = 0;
let score = 0;
let correctCount = 0;
let incorrectCount = 0;
let isInputFocused = false;
let useAllCategories = true; // Default: use all categories

// Initialize categories
let categories = {
    'kebersihan_keamanan': 'Kebersihan & Keamanan',
    'proses_produksi': 'Proses Produksi',
    'penyimpanan_suhu': 'Penyimpanan & Suhu',
    'keselamatan_prosedur': 'Keselamatan Prosedur',
    'manajemen_bahan': 'Manajemen Bahan',
    'sistem_keamanan': 'Sistem Keamanan',
    'frasa_umum': 'Frasa Umum',
    'peralatan_keselamatan': 'Peralatan Keselamatan',
    'jenis_bahaya_kerja': 'Jenis Bahaya Kerja',
    'konsep_umum': 'Konsep Umum'
};

// Romaji conversion function (tetap sama)
const toRomaji = (hiragana) => {
    const romajiMap = {
        'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
        'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
        'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
        'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
        'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
        'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
        'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
        'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
        'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
        'わ': 'wa', 'を': 'wo', 'ん': 'n',
        'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
        'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
        'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
        'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
        'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
        'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
        'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
        'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
        'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
        'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
        'みゃ': 'mya', 'みゅ': 'myu', '咪ょ': 'myo',
        'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
        'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
        'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
        'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
        'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
        'っ': 'tsu',
        'ゃ': 'ya', 'ゅ': 'yu', 'ょ': 'yo',
        'ぁ': 'a', 'ぃ': 'i', 'ぅ': 'u', 'ぇ': 'e', 'ぉ': 'o',
        'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
        'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
        'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
        'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
        'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
        'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
        'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
        'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
        'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
        'ワ': 'wa', 'ヲ': 'wo', 'ン': 'n',
        'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
        'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
        'ダ': 'da', 'ヂ': 'ji', 'ヅ': 'zu', 'デ': 'de', 'ド': 'do',
        'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
        'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',
        'キャ': 'kya', 'キュ': 'kyu', 'キョ': 'kyo',
        'シャ': 'sha', 'シュ': 'shu', 'ショ': 'sho',
        'チャ': 'cha', 'チュ': 'chu', 'チョ': 'cho',
        'ニャ': 'nya', 'ニュ': 'nyu', 'ニョ': 'nyo',
        'ヒャ': 'hya', 'ヒュ': 'hyu', 'ヒョ': 'hyo',
        'ミャ': 'mya', 'ミュ': 'myu', 'ミョ': 'myo',
        'リャ': 'rya', 'リュ': 'ryu', 'リョ': 'ryo',
        'ギャ': 'gya', 'ギュ': 'gyu', 'ギョ': 'gyo',
        'ジャ': 'ja', 'ジュ': 'ju', 'ジョ': 'jo',
        'ビャ': 'bya', 'ビュ': 'byu', 'ビョ': 'byo',
        'ピャ': 'pya', 'ピュ': 'pyu', 'ピョ': 'pyo',
        'ッ': 't',
        'ャ': 'ya', 'ュ': 'yu', 'ョ': 'yo',
        'ー': '-',
        '、': ',', '。': '.', ' ': ' '
    };

    let romaji = '';
    for (let i = 0; i < hiragana.length; i++) {
        let char = hiragana[i];
        let nextChar = hiragana[i + 1];

        if (char === 'っ' || char === 'ッ') {
            if (nextChar && romajiMap[nextChar]) {
                romaji += romajiMap[nextChar][0];
                continue;
            }
        }
        
        if (char === 'ん' || char === 'ン') {
            if (nextChar && (nextChar === 'ば' || nextChar === 'ぱ' || nextChar === 'ま' || 
                             nextChar === 'バ' || nextChar === 'パ' || nextChar === 'マ' || 
                             nextChar === 'び' || nextChar === 'ぴ' || nextChar === 'み' || 
                             nextChar === 'ビ' || nextChar === 'ピ' || nextChar === 'MI')) {
                romaji += 'm';
            } else {
                romaji += 'n';
            }
            continue;
        }

        let foundCombination = false;
        if (i + 1 < hiragana.length) {
            const combination = char + nextChar;
            if (romajiMap[combination]) {
                romaji += romajiMap[combination];
                i++;
                foundCombination = true;
            }
        }

        if (!foundCombination && romajiMap[char]) {
            romaji += romajiMap[char];
        } else if (!foundCombination) {
            romaji += char;
        }
    }
    return romaji;
};

// Function to shuffle array (tidak digunakan lagi karena kita mau urut)
// function shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
// }

// Function to get category name from key
function getCategoryNameFromKey(categoryKey) {
    const categoryNames = {
        'kebersihan_keamanan': 'Kebersihan & Keamanan',
        'proses_produksi': 'Proses Produksi',
        'penyimpanan_suhu': 'Penyimpanan & Suhu',
        'keselamatan_prosedur': 'Keselamatan Prosedur',
        'manajemen_bahan': 'Manajemen Bahan',
        'sistem_keamanan': 'Sistem Keamanan',
        'frasa_umum': 'Frasa Umum',
        'peralatan_keselamatan': 'Peralatan Keselamatan',
        'jenis_bahaya_kerja': 'Jenis Bahaya Kerja',
        'konsep_umum': 'Konsep Umum'
    };
    
    return categoryNames[categoryKey] || 'General';
}

// Initialize categories selection
function initializeCategories() {
    categoriesGrid.innerHTML = '';
    selectedCategories = Object.keys(categories); // Select all by default
    useAllCategories = true;
    
    // Add "Use All Categories" option
    const allCategoriesDiv = document.createElement('div');
    allCategoriesDiv.className = 'category-checkbox selected';
    allCategoriesDiv.id = 'all-categories-option';
    allCategoriesDiv.innerHTML = `
        <div class="checkmark"></div>
        <span class="category-name"><strong>Use All Categories</strong></span>
        <span class="category-count">112</span>
        <input type="checkbox" class="category-input" value="all" checked>
    `;
    
    allCategoriesDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        const checkbox = allCategoriesDiv.querySelector('.category-input');
        checkbox.checked = !checkbox.checked;
        
        if (checkbox.checked) {
            allCategoriesDiv.classList.add('selected');
            useAllCategories = true;
            // Deselect all individual categories
            document.querySelectorAll('.category-checkbox:not(#all-categories-option)').forEach(cb => {
                cb.classList.remove('selected');
                cb.querySelector('.category-input').checked = false;
            });
            selectedCategories = [];
        } else {
            allCategoriesDiv.classList.remove('selected');
            useAllCategories = false;
        }
    });
    
    categoriesGrid.appendChild(allCategoriesDiv);
    
    // Add individual categories
    Object.keys(categories).forEach(categoryKey => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-checkbox';
        categoryDiv.innerHTML = `
            <div class="checkmark"></div>
            <span class="category-name">${categories[categoryKey]}</span>
            <span class="category-count" id="count-${categoryKey}">0</span>
            <input type="checkbox" class="category-input" value="${categoryKey}">
        `;
        
        categoryDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            const checkbox = categoryDiv.querySelector('.category-input');
            checkbox.checked = !checkbox.checked;
            
            if (checkbox.checked) {
                categoryDiv.classList.add('selected');
                if (!selectedCategories.includes(categoryKey)) {
                    selectedCategories.push(categoryKey);
                }
                // Uncheck "Use All Categories" when individual category is selected
                const allCategoriesOption = document.getElementById('all-categories-option');
                allCategoriesOption.classList.remove('selected');
                allCategoriesOption.querySelector('.category-input').checked = false;
                useAllCategories = false;
            } else {
                categoryDiv.classList.remove('selected');
                const index = selectedCategories.indexOf(categoryKey);
                if (index > -1) {
                    selectedCategories.splice(index, 1);
                }
            }
        });
        
        categoriesGrid.appendChild(categoryDiv);
    });
}

// Update category counts
function updateCategoryCounts() {
    if (allVocabularyData.length === 0) return;
    
    Object.keys(categories).forEach(categoryKey => {
        const count = allVocabularyData.filter(item => item.category === categoryKey).length;
        const countElement = document.getElementById(`count-${categoryKey}`);
        if (countElement) {
            countElement.textContent = count;
        }
    });
}

// Load all vocabulary data
async function loadAllVocabularyData() {
    try {
        const response = await fetch('data/kotoba-foodmanufacture.json');
        const data = await response.json();
        
        // Flatten all vocabulary from all categories
        allVocabularyData = [];
        Object.keys(data).forEach(category => {
            data[category].forEach(item => {
                item.category = category;
                allVocabularyData.push(item);
            });
        });
        
        // Sort by ID (urutan ID dari 1 sampai 112)
        allVocabularyData.sort((a, b) => a.id - b.id);
        
        // Initialize categories and update counts
        initializeCategories();
        updateCategoryCounts();
        
        console.log('Loaded all vocabulary data:', allVocabularyData.length, 'items');
    } catch (error) {
        console.error('Error loading vocabulary data:', error);
    }
}

// Function to load vocabulary based on selected categories and limit
function loadVocabulary(limit) {
    let filteredVocabulary;
    
    if (useAllCategories) {
        // Jika pilih "Use All Categories", ambil semua vocabulary
        filteredVocabulary = [...allVocabularyData]; // Copy semua data
    } else if (selectedCategories.length > 0) {
        // Jika pilih kategori tertentu, filter berdasarkan kategori
        filteredVocabulary = allVocabularyData.filter(item => 
            selectedCategories.includes(item.category)
        );
    } else {
        // Jika tidak pilih apa-apa, default ke semua
        filteredVocabulary = [...allVocabularyData];
        useAllCategories = true;
    }
    
    if (filteredVocabulary.length === 0) {
        alert('No vocabulary found. Please select at least one category or use all categories.');
        return false;
    }
    
    // Ambil dari ID 1 sampai limit yang diminta, urut berdasarkan ID
    // TIDAK diacak, urut berdasarkan ID
    vocabulary = filteredVocabulary
        .sort((a, b) => a.id - b.id) // Pastikan urut berdasarkan ID
        .slice(0, limit); // Ambil dari awal sesuai limit
    
    // Reset game state
    currentCardIndex = 0;
    score = 0;
    correctCount = 0;
    incorrectCount = 0;
    
    console.log('Loaded', vocabulary.length, 'vocabulary items');
    console.log('Starting from ID:', vocabulary[0]?.id || 'none');
    console.log('Ending at ID:', vocabulary[vocabulary.length - 1]?.id || 'none');
    console.log('Use all categories:', useAllCategories);
    console.log('Selected categories:', selectedCategories);
    
    // Display first card
    displayCard();
    
    return true;
}

// Function to display current card
function displayCard() {
    if (vocabulary.length === 0) {
        frontContent.textContent = 'No vocabulary loaded.';
        backKanji.textContent = '';
        backFurigana.textContent = '';
        backMeaning.textContent = '';
        backId.textContent = '';
        categoryName.textContent = 'Loading...';
        return;
    }

    const currentCard = vocabulary[currentCardIndex];
    
    // Update front of the flashcard
    frontContent.textContent = currentCard.kanji;
    
    // Update back of the flashcard
    backKanji.textContent = currentCard.kanji;
    backFurigana.textContent = currentCard.furigana;
    backMeaning.textContent = currentCard.arti;
    backId.textContent = currentCard.id;
    
    // Update category display
    categoryName.textContent = getCategoryNameFromKey(currentCard.category);

    // Reset input and feedback
    answerInput.value = '';
    feedbackElement.className = 'feedback-message';
    feedbackText.textContent = 'Enter the romaji reading and press Check Answer';
    hintDisplay.classList.add('hide');
    hintContent.textContent = '';
    
    // Ensure card is not flipped
    flashcardElement.classList.remove('flipped');
    
    // Update game stats
    scoreDisplay.textContent = score;
    currentCardSpan.textContent = currentCardIndex + 1;
    totalCardsSpan.textContent = vocabulary.length;
    correctCountSpan.textContent = correctCount;
    incorrectCountSpan.textContent = incorrectCount;
    
    // Focus on input
    answerInput.focus();
}

// Function to flip the flashcard
function flipCard() {
    flashcardElement.classList.toggle('flipped');
}

// Function to show hint
function showHint() {
    if (vocabulary.length === 0) return;
    
    const currentCard = vocabulary[currentCardIndex];
    hintContent.textContent = `Meaning: ${currentCard.arti}`;
    hintDisplay.classList.remove('hide');
}

// Function to check answer
function checkAnswer() {
    if (vocabulary.length === 0) return;

    const currentCard = vocabulary[currentCardIndex];
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctFuriganaRomaji = toRomaji(currentCard.furigana).toLowerCase();

    if (userAnswer === correctFuriganaRomaji) {
        feedbackText.textContent = 'Correct! Well done!';
        feedbackElement.className = 'feedback-message correct';
        score += 10;
        correctCount++;
    } else {
        feedbackText.textContent = `Incorrect. Correct Romaji: ${correctFuriganaRomaji}`;
        feedbackElement.className = 'feedback-message incorrect';
        incorrectCount++;
    }
    
    // Update score and stats
    scoreDisplay.textContent = score;
    correctCountSpan.textContent = correctCount;
    incorrectCountSpan.textContent = incorrectCount;
    
    // Flip card to show answer
    flashcardElement.classList.add('flipped');
}

// Function to move to next card
function nextCard() {
    currentCardIndex++;
    if (currentCardIndex >= vocabulary.length) {
        // End of session - show results
        showResults();
        return;
    }
    displayCard();
}

// Function to show results
function showResults() {
    const accuracy = vocabulary.length > 0 ? Math.round((correctCount / vocabulary.length) * 100) : 0;
    
    // Update results display
    resultTotal.textContent = vocabulary.length;
    resultCorrect.textContent = correctCount;
    resultIncorrect.textContent = incorrectCount;
    resultScore.textContent = score;
    resultAccuracy.textContent = `${accuracy}%`;
    
    // Hide game container, show results
    document.querySelector('.flashcard-container').classList.add('hide');
    resultsContainer.classList.remove('hide');
}

// Function to restart session
function restartSession() {
    // Hide results, show game
    resultsContainer.classList.add('hide');
    document.querySelector('.flashcard-container').classList.remove('hide');
    
    // Reset and restart
    flashcardGameWrapper.classList.add('hide');
    flashcardSetupContainer.classList.remove('hide');
}

// Event Listeners for input focus (to disable H shortcut when typing)
answerInput.addEventListener('focus', () => {
    isInputFocused = true;
});

answerInput.addEventListener('blur', () => {
    isInputFocused = false;
});

// Main event listeners
checkButton.addEventListener('click', checkAnswer);
hintButton.addEventListener('click', showHint);
nextButton.addEventListener('click', nextCard);

// Input field Enter key
answerInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (!flashcardGameWrapper.classList.contains('hide') && 
        !resultsContainer.classList.contains('hide')) {
        
        switch(event.code) {
            case 'Space':
                event.preventDefault();
                flipCard();
                break;
            case 'Enter':
                if (document.activeElement !== answerInput) {
                    checkAnswer();
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                nextCard();
                break;
            case 'KeyH':
                // Only show hint if input is not focused
                if (!isInputFocused) {
                    event.preventDefault();
                    showHint();
                }
                break;
        }
    }
});

// Click on flashcard to flip
flashcardElement.addEventListener('click', flipCard);

// Start game button
startFlashcardGameBtn.addEventListener('click', () => {
    const questionCount = parseInt(questionCountInput.value);
    if (isNaN(questionCount) || questionCount < 5 || questionCount > 112) {
        alert('Please enter a valid number of flashcards between 5 and 112.');
        return;
    }
    
    flashcardSetupContainer.classList.add('hide');
    flashcardGameWrapper.classList.remove('hide');
    
    // Hide results container if it's visible
    resultsContainer.classList.add('hide');
    document.querySelector('.flashcard-container').classList.remove('hide');
    
    // Load vocabulary
    if (!loadVocabulary(questionCount)) {
        // If loading failed, show setup again
        flashcardGameWrapper.classList.add('hide');
        flashcardSetupContainer.classList.remove('hide');
    }
});

// Category control buttons
selectAllCategoriesBtn.addEventListener('click', () => {
    // Select all individual categories
    selectedCategories = Object.keys(categories);
    useAllCategories = false;
    
    document.querySelectorAll('.category-checkbox:not(#all-categories-option)').forEach(checkbox => {
        checkbox.classList.add('selected');
        checkbox.querySelector('.category-input').checked = true;
    });
    
    // Uncheck "Use All Categories"
    const allCategoriesOption = document.getElementById('all-categories-option');
    allCategoriesOption.classList.remove('selected');
    allCategoriesOption.querySelector('.category-input').checked = false;
});

deselectAllCategoriesBtn.addEventListener('click', () => {
    // Deselect all individual categories
    selectedCategories = [];
    useAllCategories = false;
    
    document.querySelectorAll('.category-checkbox:not(#all-categories-option)').forEach(checkbox => {
        checkbox.classList.remove('selected');
        checkbox.querySelector('.category-input').checked = false;
    });
    
    // Check "Use All Categories" as default
    const allCategoriesOption = document.getElementById('all-categories-option');
    allCategoriesOption.classList.add('selected');
    allCategoriesOption.querySelector('.category-input').checked = true;
    useAllCategories = true;
});

// Quick buttons for number of cards
quickButtons.forEach(button => {
    button.addEventListener('click', () => {
        questionCountInput.value = button.getAttribute('data-value');
    });
});

// Results actions
if (restartSessionBtn) {
    restartSessionBtn.addEventListener('click', restartSession);
}

if (backToHomeBtn) {
    backToHomeBtn.addEventListener('click', () => {
        resultsContainer.classList.add('hide');
        flashcardGameWrapper.classList.add('hide');
        flashcardSetupContainer.classList.remove('hide');
    });
}

if (endSessionBtn) {
    endSessionBtn.addEventListener('click', showResults);
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    loadAllVocabularyData();
    console.log('Flashcard game initialized');
});