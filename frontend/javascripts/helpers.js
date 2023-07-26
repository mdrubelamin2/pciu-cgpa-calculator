export const select = selector => document.querySelector(selector)

export const addEvent = (elm, eventType, cb) => { elm.addEventListener(eventType, cb) }

export const setInnerHTML = (elm, html) => { elm.innerHTML = html }

export const setTextContent = (elm, text) => { elm.textContent = text }

export const createElm = elmType => document.createElement(elmType)

export const appendChild = (parent, child) => { parent.appendChild(child) }

export const setAttr = (elm, attr, value) => { elm.setAttribute(attr, value) }

export const setClass = (elm, className, remove = 0) => {
    if (remove) {
        elm.classList.remove(className)
    } else {
        elm.classList.add(className)
    }
}

export const showToast = (msg = '', type = 'error') => {
    const toastConfig = {
        text: msg,
        gravity: 'bottom',
        style: {
            borderRadius: '8px',
        }
    }
    if (type === 'success') {
        toastConfig.style.background = '#00a3ff'
        toastConfig.style.color = '#fff'
    } else if (type === 'error') {
        toastConfig.style.background = '#f44336'
        toastConfig.style.color = '#fff'
    }
    Toastify(toastConfig).showToast();
}

export const fetchApi = async (url, method = 'GET', data = {}) => {
    const serverErrMsg = 'Looks like there are some problem with the PCIU server! Please try again later.'

    try {
        const response = await fetch(url)
        const data = await response.json()
        return data
    } catch (_) {
        showToast(serverErrMsg)
        return null
    }
}

export const roundToTwoDecimal = (num, onlyFirstTwoDecimal = false) => onlyFirstTwoDecimal ? num.toFixed(2) : (Math.round(num * 100) / 100)

export const getAverageCGPAandCredits = (resultData, toIndex) => {
    let totalCreditHrs = 0
    let totalCGPA = 0
    const allResults = toIndex !== undefined ? resultData.slice(0, toIndex + 1) : resultData
    allResults.forEach(trimesterResult => {
        totalCGPA += trimesterResult.currentGPA * trimesterResult.totalCreditHrs
        totalCreditHrs += trimesterResult.completedCreditHrs
    })
    totalCGPA = totalCGPA / totalCreditHrs
    let totalAverageCGPA = Number.isNaN(totalCGPA) ? 0 : roundToTwoDecimal(totalCGPA, true)
    return { totalCreditHrs, totalAverageCGPA }
}

