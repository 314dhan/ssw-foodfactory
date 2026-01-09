document.addEventListener('DOMContentLoaded', () => {
    const langInBtn = document.getElementById('lang-in');
    const langJpBtn = document.getElementById('lang-jp');
    const quizWrapper = document.getElementById('quiz-wrapper');
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    const questionNumberEl = document.getElementById('question-number');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const scoreTextEl = document.getElementById('score-text');
    const feedbackTextEl = document.getElementById('feedback-text');
    const quizTitleEl = document.getElementById('quiz-title');


    let allQuestions = {};
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let currentLanguage = 'in';
    let userAnswers = [];

    const langConfig = {
        in: {
            title: "Latihan Soal SSW Pengolahan Makanan",
            questionLabel: "Soal",
            nextButton: "Selanjutnya",
            resultsButton: "Lihat Hasil",
            restartButton: "Coba Lagi",
            resultTitle: "Hasil Kuis",
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
            scoreMessage: (score, total) => `${total}問中${score}問正解しました。`,
            feedback: {
                good: "素晴らしい！あなたの理解は非常に良いです。",
                medium: "良い調子です！練習を続けてください。",
                bad: "大丈夫、もっと良くなるために再挑戦してください！"
            }
        }
    };

    fetch('questions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            allQuestions = data;
            startQuiz('in');
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            questionTextEl.textContent = 'Gagal memuat soal. Silakan periksa file questions.json dan coba lagi.';
        });

    langInBtn.addEventListener('click', () => switchLanguage('in'));
    langJpBtn.addEventListener('click', () => switchLanguage('jp'));
    nextBtn.addEventListener('click', handleNextButton);
    restartBtn.addEventListener('click', () => startQuiz(currentLanguage));
    
    function switchLanguage(lang) {
        currentLanguage = lang;
        langInBtn.classList.toggle('active', lang === 'in');
        langJpBtn.classList.toggle('active', lang === 'jp');
        startQuiz(lang);
    }

    function startQuiz(lang) {
        currentLanguage = lang;
        currentQuestions = allQuestions[lang];
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        
        quizTitleEl.textContent = langConfig[lang].title;
        restartBtn.textContent = langConfig[lang].restartButton;
        resultContainer.classList.add('hide');
        quizContainer.classList.remove('hide');
        
        loadQuestion();
    }

    function loadQuestion() {
        resetState();
        const question = currentQuestions[currentQuestionIndex];
        questionNumberEl.textContent = `${langConfig[currentLanguage].questionLabel} ${currentQuestionIndex + 1}/${currentQuestions.length}`;
        questionTextEl.textContent = question.question;

        question.options.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.classList.add('option-btn');
            button.addEventListener('click', () => selectAnswer(button, option));
            optionsContainer.appendChild(button);
        });
        
        nextBtn.textContent = (currentQuestionIndex < currentQuestions.length - 1)
            ? langConfig[currentLanguage].nextButton
            : langConfig[currentLanguage].resultsButton;
    }
    
    function resetState() {
        while (optionsContainer.firstChild) {
            optionsContainer.removeChild(optionsContainer.firstChild);
        }
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
        const percentage = (score / total);
        let feedback;

        if (percentage >= 0.8) {
            feedback = langConfig[currentLanguage].feedback.good;
        } else if (percentage >= 0.5) {
            feedback = langConfig[currentLanguage].feedback.medium;
        } else {
            feedback = langConfig[currentLanguage].feedback.bad;
        }
        
        document.getElementById('result-title').textContent = langConfig[currentLanguage].resultTitle;
        scoreTextEl.textContent = langConfig[currentLanguage].scoreMessage(score, total);
        feedbackTextEl.textContent = feedback;
    }
});
