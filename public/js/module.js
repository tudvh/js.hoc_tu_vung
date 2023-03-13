// Hàm này được sử dụng để viết hoa chữ cái đầu tiên của một chuỗi
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Hàm này được sử dụng để lấy ngẫu nhiên một phần tử trong một mảng
function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function getRandomElements(array, count, excludedElements = []) {
    // Lọc các phần tử trong mảng không nằm trong danh sách bị loại trừ
    const filteredArray = array.filter(
        (element) => !excludedElements.includes(element)
    );

    // Tạo một mảng mới chứa các phần tử ngẫu nhiên được chọn từ mảng đã lọc
    const randomElements = [];

    // Lặp lại việc chọn phần tử ngẫu nhiên cho đến khi đạt được số lượng mong muốn hoặc hết phần tử trong mảng đã lọc
    while (randomElements.length < count && filteredArray.length > 0) {
        const randomElement = getRandomElement(filteredArray);
        randomElements.push(randomElement);

        // Xóa phần tử đã chọn khỏi mảng đã lọc để tránh chọn trùng lặp
        const index = filteredArray.indexOf(randomElement);
        filteredArray.splice(index, 1);
    }

    return randomElements;
}

function shuffleArray(array) {
    // Sắp xếp mảng theo thứ tự ngẫu nhiên bằng cách so sánh hai số ngẫu nhiên
    array.sort(() => Math.random() - 0.5);
    return array;
}

// View in fullscreen
function openFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        // Safari
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        // IE11
        elem.msRequestFullscreen();
    }
}

// Close fullscreen
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        // Safari
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        // IE11
        document.msExitFullscreen();
    }
}
