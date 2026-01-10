document.addEventListener('DOMContentLoaded', () => {
    // Setup Elements
    const setupContainer = document.getElementById('setup-container');
    const setupLangInBtn = document.getElementById('setup-lang-in');
    const setupLangJpBtn = document.getElementById('setup-lang-jp');
    const questionCountInput = document.getElementById('question-count');
    const startQuizBtn = document.getElementById('start-quiz-btn');

    // Main Quiz Elements
    const header = document.querySelector('.header');
    const headerLanguageSelector = header.querySelector('.language-selector');
    const langInBtnHeader = document.getElementById('lang-in'); 
    const langJpBtnHeader = document.getElementById('lang-jp'); 
    const quizWrapper = document.getElementById('quiz-wrapper');
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    const reviewContainer = document.getElementById('review-container');
    const reviewContent = document.getElementById('review-content');
    
    // Buttons
    const reviewBtn = document.getElementById('review-btn');
    const backToResultsBtn = document.getElementById('back-to-results-btn');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');

    // Display Elements
    const questionNumberEl = document.getElementById('question-number');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const scoreTextEl = document.getElementById('score-text');
    const feedbackTextEl = document.getElementById('feedback-text');
    const quizTitleEl = document.getElementById('quiz-title');

    let allQuestions = {};
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];
    let selectedLang = 'in';

    const langConfig = {
        in: {
            title: "Latihan Soal SSW Pengolahan Makanan",
            questionLabel: "Soal",
            nextButton: "Selanjutnya",
            resultsButton: "Lihat Hasil",
            restartButton: "Coba Lagi",
            resultTitle: "Hasil Kuis",
            reviewTitle: "Tinjau Jawaban Anda",
            backButton: "Kembali ke Hasil",
            scoreMessage: (score, total) => `Anda benar ${score} dari ${total} soal.`,
            feedback: {
                good: "Luar biasa! Pemahaman Anda sangat baik.",
                medium: "Bagus! Teruslah berlatih.",
                bad: "Tidak apa-apa, coba lagi untuk lebih baik!"
            }
        },
        jp: {
            title: "食品加工SSW技能試験練習問題",
            questionLabel: "問題",
            nextButton: "次へ",
            resultsButton: "結果を見る",
            restartButton: "もう一度試す",
            resultTitle: "クイズの結果",
            reviewTitle: "あなたの答えを確認する",
            backButton: "結果に戻る",
            scoreMessage: (score, total) => `${total}問中${score}問正解しました。`,
            feedback: {
                good: "素晴らしい！あなたの理解は非常に良いです。",
                medium: "良い調子です！練習を続けてください。",
                bad: "大丈夫、もっと良くなるために再挑戦してください！"
            }
        }
    };

    // --- UI Update Functions ---
    function updateProgressBar(current, total) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const percentage = total > 0 ? (current / total) * 100 : 0;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${current}/${total}`;
    }

    function updateScoreCircle(score, total) {
        const circleProgress = document.getElementById('circle-progress');
        const scorePercent = document.getElementById('score-percent');
        const percentage = total > 0 ? (score / total) * 100 : 0;
        const degrees = (percentage / 100) * 360;
        circleProgress.style.background = `conic-gradient(var(--primary-color) ${degrees}deg, var(--border-color) ${degrees}deg)`;
        scorePercent.textContent = `${Math.round(percentage)}%`;
    }

    // --- Data Fetching ---
    fetch('questions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            allQuestions = data;
            // Enable the start button once data is loaded
            startQuizBtn.disabled = false;
            startQuizBtn.textContent = 'Mulai Kuis';
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            setupContainer.innerHTML = '<h1>Gagal memuat soal.</h1><p>Silakan periksa file questions.json dan coba lagi.</p>';
        });

    // --- Event Listeners ---
    setupLangInBtn.addEventListener('click', () => setSetupLanguage('in'));
    setupLangJpBtn.addEventListener('click', () => setSetupLanguage('jp'));
    startQuizBtn.addEventListener('click', handleStartQuiz);
    
    nextBtn.addEventListener('click', handleNextButton);
    restartBtn.addEventListener('click', () => {
        quizWrapper.classList.add('hide');
        header.classList.add('hide');
        resultContainer.classList.add('hide');
        reviewContainer.classList.add('hide');
        setupContainer.classList.remove('hide');
        
        // TAMPILKAN KEMBALI language selector di header
        headerLanguageSelector.classList.remove('hide');
    });

    reviewBtn.addEventListener('click', showReview);
    backToResultsBtn.addEventListener('click', () => {
        reviewContainer.classList.add('hide');
        resultContainer.classList.remove('hide');
    });

    // --- Setup Flow ---
    function setSetupLanguage(lang) {
        selectedLang = lang;
        setupLangInBtn.classList.toggle('active', lang === 'in');
        setupLangJpBtn.classList.toggle('active', lang === 'jp');
    }

    function handleStartQuiz() {
        const numQuestions = parseInt(questionCountInput.value, 10);
        if (numQuestions <= 0 || !allQuestions[selectedLang]) {
            return;
        }

        setupContainer.classList.add('hide');
        header.classList.remove('hide');
        
        // SEMBUNYIKAN language selector di header
        headerLanguageSelector.classList.add('hide');
        
        quizWrapper.classList.remove('hide');
        quizContainer.classList.remove('hide');
        resultContainer.classList.add('hide');
        reviewContainer.classList.add('hide');

        startQuiz(selectedLang, numQuestions);
    }
    
    // --- Quiz Flow ---
    function startQuiz(lang, numQuestions) {
        selectedLang = lang;
        
        // Shuffle questions and take the requested number
        if (allQuestions[lang]) {
            currentQuestions = allQuestions[lang].sort(() => 0.5 - Math.random()).slice(0, numQuestions);
        } else {
            currentQuestions = [];
            console.error(`Tidak ada soal untuk bahasa: ${lang}`);
        }
        
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        
        // Update UI language untuk header (hanya untuk konsistensi)
        if (lang === 'in') {
            langInBtnHeader.classList.add('active');
            langJpBtnHeader.classList.remove('active');
        } else {
            langJpBtnHeader.classList.add('active');
            langInBtnHeader.classList.remove('active');
        }
        
        // Terjemahkan teks UI
        const config = langConfig[lang];
        quizTitleEl.textContent = config.title;
        restartBtn.innerHTML = `<i class="fas fa-play-circle"></i> ${config.restartButton}`;
        reviewBtn.innerHTML = `<i class="fas fa-redo"></i> ${config.reviewTitle}`;
        document.getElementById('review-title').textContent = config.reviewTitle;
        backToResultsBtn.innerHTML = `<i class="fas fa-arrow-left"></i> ${config.backButton}`;
        
        updateProgressBar(0, currentQuestions.length);
        loadQuestion();
    }

    function loadQuestion() {
        if (currentQuestions.length === 0) {
            questionTextEl.textContent = 'Soal tidak ditemukan untuk bahasa ini.';
            optionsContainer.innerHTML = '';
            nextBtn.classList.add('hide');
            return;
        }
        resetState();
        updateProgressBar(currentQuestionIndex + 1, currentQuestions.length);
        const question = currentQuestions[currentQuestionIndex];
        questionNumberEl.textContent = `${langConfig[selectedLang].questionLabel} ${currentQuestionIndex + 1}/${currentQuestions.length}`;
        questionTextEl.textContent = question.question;

        question.options.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.classList.add('option-btn');
            button.addEventListener('click', () => selectAnswer(button, option));
            optionsContainer.appendChild(button);
        });
        
        nextBtn.textContent = (currentQuestionIndex < currentQuestions.length - 1)
            ? langConfig[selectedLang].nextButton
            : langConfig[selectedLang].resultsButton;
    }
    
    function resetState() {
        optionsContainer.innerHTML = '';
        nextBtn.classList.add('hide');
    }

    function selectAnswer(selectedButton, selectedOption) {
        const correctAnswer = currentQuestions[currentQuestionIndex].answer;
        userAnswers[currentQuestionIndex] = selectedOption;

        Array.from(optionsContainer.children).forEach(button => {
            button.disabled = true;
            if (button.innerText === correctAnswer) {
                button.classList.add('correct');
            } else {
                button.classList.add('incorrect');
            }
        });

        if (selectedOption === correctAnswer) {
            score++;
        }
        
        nextBtn.classList.remove('hide');
    }
    
    function handleNextButton(){
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        quizContainer.classList.add('hide');
        resultContainer.classList.remove('hide');
        
        const total = currentQuestions.length;
        updateScoreCircle(score, total);

        const percentage = total > 0 ? (score / total) : 0;
        let feedback;

        if (percentage >= 0.8) {
            feedback = langConfig[selectedLang].feedback.good;
        } else if (percentage >= 0.5) {
            feedback = langConfig[selectedLang].feedback.medium;
        } else {
            feedback = langConfig[selectedLang].feedback.bad;
        }
        
        document.getElementById('result-title').textContent = langConfig[selectedLang].resultTitle;
        scoreTextEl.textContent = langConfig[selectedLang].scoreMessage(score, total);
        feedbackTextEl.textContent = feedback;
    }

    function showReview() {
        resultContainer.classList.add('hide');
        reviewContainer.classList.remove('hide');
        reviewContent.innerHTML = '';

        currentQuestions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.answer;

            const reviewItem = document.createElement('div');
            reviewItem.classList.add('review-item');

            reviewItem.innerHTML = `
                <p><strong>${index + 1}. ${question.question}</strong></p>
                <div class="user-answer ${isCorrect ? 'correct' : 'incorrect'}">
                    Jawaban Anda: ${userAnswer || 'Tidak dijawab'}
                </div>
                ${!isCorrect ? `<div class="correct-answer">Jawaban Benar: ${question.answer}</div>` : ''}
            `;
            reviewContent.appendChild(reviewItem);
        });
    }

    // Initial state
    startQuizBtn.disabled = true;
    startQuizBtn.textContent = 'Memuat Soal...';
});