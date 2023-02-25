// Get the HTML element
const question_html = document.getElementById("question");
const load_html = document.querySelector(".load-wrapper");

// Initialize variables for the list of questions, the list of questions to be shown, and the current question number
let questions_show_obj = null;
let list_answer = null;
let question_current = 0;

// Asynchronously fetch the list of question-answer pairs from a CSV file and parse it using the Papa.parse library
async function get_list_questionAnswer() {
    try {
        // show loader
        load_html.classList.remove("hidden");

        const response = await fetch("public/csv/vocabulary.csv");
        const data = await response.text();
        const results = await Papa.parse(data, {
            header: true,
            delimiter: ",",
            skipEmptyLines: true,
        });
        // set data all question answer
        all_questions = results.data;
        all_questions = capitalizeFirstLetterQA(all_questions);

        // set data question show
        questions_show_obj = choose_random_obj(all_questions, 10);
        console.log(questions_show_obj);

        // set data list answer
        list_answer = get_list_answer(all_questions);

        show_question(question_current);
    } catch (error) {
        console.error(error);
    }
}

// Display the current question and its corresponding answer choices
function show_question(index_q) {
    // show loader
    load_html.classList.remove("hidden");

    question_html.innerHTML = `<h1>Câu ${index_q + 1}</h1>
    <p>Trong tiếng Anh, từ <strong>${
        questions_show_obj[index_q].en
    }</strong> có nghĩa là gì?</p>`;

    show_answers();

    // hide loader
    setTimeout(function () {
        load_html.classList.add("hidden");
    }, 1000);
}

// Display the answer choices for the current question
function show_answers() {
    answer_text = get_answers();

    for (let i = 0; i < 4; i++) {
        answers[i].querySelector(".card-text").innerText = answer_text[i];
    }
}

// Get the answer choices for the current question by selecting a correct answer and three incorrect ones and shuffling them
function get_answers() {
    a = [];
    // Thêm 3 đáp án sai từ list answer
    a = choose_random_elements(list_answer, 3, get_correct_answer());
    // Add the correct answer to the answer array
    a.push(get_correct_answer());
    // Shuffle the answer array
    a = shuffleArray(a);

    return a;
}

function get_correct_answer() {
    return questions_show_obj[question_current].vi;
}

function get_list_answer(list_qa) {
    answer = [];

    list_qa.forEach((qa) => {
        answer.push(qa.vi);
    });

    return answer;
}
