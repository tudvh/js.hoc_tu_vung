// get elements
const audio_correct = document.getElementById("audio_correct");
const audio_wrong = document.getElementById("audio_wrong");

// capitalize first letter of each word in object properties
function capitalizeFirstLetterQA(list_obj) {
    list_obj.forEach((obj) => {
        obj.en = obj.en.charAt(0).toUpperCase() + obj.en.slice(1);
        obj.vi = obj.vi.charAt(0).toUpperCase() + obj.vi.slice(1);
    });

    return list_obj;
}

// choose a random number of objects from an object array
function choose_random_obj(obj, count) {
    const keys = Object.keys(obj);
    const randomKeys = keys.sort(() => Math.random() - 0.5).slice(0, count);
    const randomValues = randomKeys.map((key) => obj[key]);
    return randomValues;
}

// shuffle an array randomly
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// shuffle an object randomly
function shuffleObject(obj) {
    const shuffledKeys = Object.keys(obj).sort(() => Math.random() - 0.5);
    const shuffledObject = {};
    shuffledKeys.forEach((key) => (shuffledObject[key] = obj[key]));
    return shuffledObject;
}

// display correct result
function display_correct() {
    resultModal.classList.remove("wrong");
    resultModal.classList.add("correct");
    resultText.textContent = "Tuyệt vời!";
    resultMessage.textContent = "";
    nextButton.textContent = "Tiếp tục";
    resultIcon.classList.remove("bi-x-circle-fill");
    resultIcon.classList.add("bi-check-circle-fill");
}

// display wrong result
function display_wrong() {
    resultModal.classList.remove("correct");
    resultModal.classList.add("wrong");
    resultText.textContent = "Không chính xác";
    resultMessage.innerHTML = `<strong>Đáp án đúng: </strong>${get_correct_answer()}`;
    nextButton.textContent = "Đã hiểu";
    resultIcon.classList.remove("bi-check-circle-fill");
    resultIcon.classList.add("bi-x-circle-fill");
}

// load audio elements
function load_audio() {
    audio_correct.load();
    audio_wrong.load();
}

// play correct audio
function play_correct_audio() {
    audio_correct.play();
}

// play wrong audio
function play_wrong_audio() {
    audio_wrong.play();
}

// reset CSS styles for question and answers
function reset_css_question() {
    // hide result overlay
    resultOverlay.classList.add("hidden");
    // disable next button
    nextButton.classList.add("disabled");
    // reset answer selections
    answers.forEach((answer) => {
        answer.classList.remove("selected");
    });
}
