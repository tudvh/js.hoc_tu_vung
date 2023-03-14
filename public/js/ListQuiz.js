// Class ListQuiz dùng để quản lý danh sách các câu hỏi trong một bài trắc nghiệm.
class ListQuiz {

    // Khởi tạo đối tượng ListQuiz với các thông tin truyền vào.
    constructor(listQuiz, type, listAnswer) {
        this.listQuiz = listQuiz;
        this.type = type;
        this.listAnswer = listAnswer;
        this.current = 0;
    }

    // Trả về số lượng câu hỏi trong bài trắc nghiệm.
    getLength() {
        return this.listQuiz.length;
    }

    // Trả về câu hỏi hiện tại.
    getCurrentQuizObject() {
        return this.listQuiz[this.current];
    }

    // Thêm một câu hỏi mới vào danh sách.
    addQuiz(quiz) {
        this.listQuiz.push(quiz);
    }

    // Trả về nội dung câu hỏi hiện tại để hiển thị trên giao diện.
    getCurrentQuestionHTML() {
        const questionText = `Trong tiếng Anh, <strong>"${
            this.getCurrentQuizObject().vi
        }"</strong> có nghĩa là gì?`;

        return `<h1>${this.getQuestionHeader()}</h1><p>${questionText}</p>`;
    }

    // Trả về tiêu đề câu hỏi hiện tại để hiển thị trên giao diện.
    getQuestionHeader() {
        return this.type === "learning"
            ? `Câu ${this.current + 1}:`
            : this.type === "wrong"
            ? "Câu sai trước đây:"
            : null;
    }

    // Trả về danh sách các câu trả lời cho câu hỏi hiện tại.
    getCurrentAnswers() {
        const answers = [];

        answers.push(
            ...getRandomElements(this.listAnswer, 3, this.getCorrectAnswer())
        );

        answers.push(this.getCorrectAnswer());

        shuffleArray(answers);

        return answers;
    }

    // Lấy câu trả lời đúng.
    getCorrectAnswer() {
        return this.getCurrentQuizObject().en;
    }

    addQuizsToSession(sessionQuizs) {
        sessionQuizs = sessionQuizs || [];

        this.listQuiz.forEach((quiz) => {
            const index = sessionQuizs.findIndex(
                (ssQuiz) => ssQuiz.id === quiz.id
            );
            sessionQuizs[index]
                ? (sessionQuizs[index].count += 2)
                : sessionQuizs.push({ id: quiz.id, count: 2 });
        });

        return sessionQuizs;
    }

    addWrongQuizsToSession(sessionQuizs) {
        this.listQuiz.forEach((quiz) => {
            const index = sessionQuizs.findIndex(
                (ssQuiz) => ssQuiz.id === quiz.id
            );
            sessionQuizs[index] && sessionQuizs[index].count--;
        });

        return sessionQuizs;
    }
}
