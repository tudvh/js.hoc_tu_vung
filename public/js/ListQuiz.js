// Lớp ListQuiz đại diện cho một danh sách các câu hỏi
class ListQuiz {
    // Khởi tạo một đối tượng ListQuiz mới
    constructor(listQuiz, type, listAnswer) {
        this.listQuiz = listQuiz;
        this.type = type;
        this.listAnswer = listAnswer;
        this.current = 0;
    }

    // Lấy chiều dài của listQuiz
    getLength() {
        return this.listQuiz.length;
    }

    getCurrentQuiz() {
        return this.listQuiz[this.current];
    }

    // Thêm một câu hỏi mới vào danh sách
    addQuiz(quiz) {
        this.listQuiz.push(quiz);
    }

    // Lấy câu hỏi hiện tại
    getCurrentQuestion() {
        // Lấy phần nội dung của câu hỏi hiện tại
        const questionText = `Trong tiếng Anh, <strong>"${
            this.listQuiz[this.current].vi
        }"</strong> có nghĩa là gì?`;

        return `<h1>${this.getQuestionHeader()}</h1><p>${questionText}</p>`;
    }

    // Lấy phần header của câu hỏi hiện tại
    getQuestionHeader() {
        if (this.type == "learning") {
            return `Câu ${this.current + 1}:`;
        } else if (this.type == "wrong") {
            return "Câu sai trước đây:";
        } else {
            return null;
        }
    }

    // Lấy các phương án trả lời cho câu hỏi hiện tại bằng cách chọn một đáp án đúng và ba đáp án sai và xáo trộn chúng.
    getCurrentAnswers() {
        const answers = [];

        // Thêm 3 đáp án sai từ listAnswer
        answers.push(
            ...getRandomElements(this.listAnswer, 3, this.getCorrectAnswer())
        );

        // Thêm đáp án đúng
        answers.push(this.getCorrectAnswer());

        // Xáo trộn mảng đáp án
        shuffleArray(answers);

        return answers;
    }

    // Lấy câu trả lời chính xác cho câu hỏi hiện tại.
    getCorrectAnswer() {
        return this.listQuiz[this.current].en;
    }

    addQuizsToSession(sessionQuizs) {
        this.listQuiz.forEach((quiz) => {
            let index;

            if (sessionQuizs) {
                index = sessionQuizs.findIndex(
                    (ssQuiz) => ssQuiz.id === quiz.id
                );
            } else {
                index = -1;
                sessionQuizs = [];
            }

            if (index != -1) {
                sessionQuizs[index].count += 2;
            } else {
                sessionQuizs.push({ id: quiz.id, count: 2 });
            }
        });

        return sessionQuizs;
    }

    addWrongQuizsToSession(sessionQuizs) {
        this.listQuiz.forEach((quiz) => {
            const index = sessionQuizs.findIndex(
                (ssQuiz) => ssQuiz.id === quiz.id
            );
            if (index != -1) {
                sessionQuizs[index].count -= 1;
            }
        });

        return sessionQuizs;
    }
}
