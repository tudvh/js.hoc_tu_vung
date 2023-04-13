// Hàm đổi chữ cái đầu tiên của chuỗi thành chữ in hoa
const capitalizeFirstLetter = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

// Hàm lấy ngẫu nhiên một phần tử trong một mảng
const getRandomElement = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};

// Hàm trộn ngẫu nhiên các phần tử trong một mảng
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Hàm lấy ngẫu nhiên một số phần tử trong một mảng
const getRandomElements = (array, count, excludedElements = []) => {
    const filteredArray = array.filter((element) => !excludedElements.includes(element));
    const randomElements = shuffleArray(filteredArray).slice(0, count);
    return randomElements;
};

// Hàm chuyển đổi trạng thái toàn màn hình
const toggleFullscreen = () => {
    const elem = document.documentElement;
    const fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    if (!fullscreenElement) {
        const requestFullscreen = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.msRequestFullscreen;
        requestFullscreen && requestFullscreen();
    } else {
        const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
        exitFullscreen && exitFullscreen();
    }
};
