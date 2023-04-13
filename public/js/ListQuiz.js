class ListQuiz {
    // Constructor
    constructor(listQuiz, type, listAnswer) {
        this.listQuiz = listQuiz;
        this.type = type;
        this.listAnswer = listAnswer;
        this.current = 0;
    }

    // Get length of listQuiz
    get length() {
        return this.listQuiz.length;
    }

    // Get current quiz object
    get currentQuizObject() {
        return this.listQuiz[this.current];
    }

    // Add quiz to listQuiz
    addQuiz(quiz) {
        this.listQuiz.push(quiz);
    }

    // Get current question HTML
    get currentQuestionHTML() {
        const questionText = `Trong tiếng Anh, <strong>"${this.currentQuizObject.vi}"</strong> có nghĩa là gì?`;

        return `<h1>${this.questionHeader}</h1><p>${questionText}</p>`;
    }

    // Get question header
    get questionHeader() {
        return this.type === 'learning'
            ? `Câu ${this.current + 1}:`
            : this.type === 'wrong'
            ? 'Câu sai trước đây:'
            : null;
    }

    // Get current answers
    getCurrentAnswers() {
        const answers = [];

        answers.push(...getRandomElements(this.listAnswer, 3, this.correctAnswer));

        answers.push(this.correctAnswer);

        return shuffleArray(answers);
    }

    // Get correct answer
    get correctAnswer() {
        return this.currentQuizObject.en;
    }

    // Add quizs to session
    addQuizsToSession(sessionQuizs = []) {
        this.listQuiz.forEach((quiz) => {
            const index = sessionQuizs.findIndex((ssQuiz) => ssQuiz.id === quiz.id);
            sessionQuizs[index]?.count
                ? (sessionQuizs[index].count += 2)
                : sessionQuizs.push({ id: quiz.id, count: 2 });
        });

        return sessionQuizs;
    }

    // Add wrong quizs to session
    addWrongQuizsToSession(sessionQuizs) {
        this.listQuiz.forEach((quiz) => {
            const index = sessionQuizs.findIndex((ssQuiz) => ssQuiz.id === quiz.id);
            sessionQuizs[index]?.((count -= 1));
        });

        return sessionQuizs;
    }
}
