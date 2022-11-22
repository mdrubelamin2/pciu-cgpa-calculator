(() => {
const setVh = function () {
    const dvh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--1dvh', (dvh + "px"));
    };
// We run the calculation as soon as possible (eg. the script is in document head)
setVh()

// We run the calculation again when DOM has loaded
document.addEventListener('DOMContentLoaded', () => setVh())

// We run the calculation when window is resized
window.addEventListener('resize', () => setVh())
})()