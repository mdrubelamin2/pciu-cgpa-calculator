import { addEvent, select, setClass, setInnerHTML, setTextContent } from "./helpers.js"

// modal code start - rahat
const modal = select(".modal")
const modalTitleElm = select(".title")
const closeBtn = select("#closeBtn")

const setModal = status => {
    if (status) setClass(modal, 'show')
    else setClass(modal, 'show', 1)
}

addEvent(modal, 'click', event => {
    const isInsideModal = event.target.closest('.modal-container');
    if (isInsideModal === null) closeBtn.click()
})

addEvent(closeBtn, 'click', () => setModal(false))

const convertGradeToClassName = letter => {
    const grade = letter.trim().toLowerCase()
    const [_, stat] = grade

    if (grade === '-') return 'i'
    if (!stat) return grade
    if (stat == "+") return grade.replace(stat, "-plus")
    if (stat == "-") return grade.replace(stat, "-minus")
}

export const perTrimResults = (trimResult) => {
    const modalContent = select(".modal-content")
    setInnerHTML(modalContent, '')
    setTextContent(modalTitleElm, `${trimResult.trimester} Trimester Result`)

    const { individuals } = trimResult

    const modalResultHtml = individuals.map((item, i) => `<div class="grid-container">
<div class="grid-item item-no-one">
  <div class="center">
    <span class="serialNo">${i + 1}</span>
  </div>
</div>
<div class="grid-item item-no-two">
  <div class="courseName">${item.courseTitle} <span class="courseCode">${item.courseCode
        }</span>
  </div>
</div>
<div class="grid-item item-no-three">
  <div class="leftBox">
    <span>  <img class="svg" src="./images/grade.svg" alt=""> </span>
    <span class="grade">Grade :</span>
    <span class="gradePoint">${item.GradePoint}</span>
    <span class="cgpaLetter ${convertGradeToClassName(item.LetterGrade)}">${item.LetterGrade}</span>
  </div>
  <div class="middleBox">
    <span> <img  class="svg" src="./images/type.svg" alt=""> </span> 
    <span class="type">Type :</span>
    <span class="typeStatus">${item.status}</span>
  </div>
  <div class="rightBox">
  <span>   <img  class="svg" src="./images/credit.svg" alt=""> </span>
    <span class="credit">Credit :</span>
    <span class="subCreditPoint">${item.creditHr}</span>
  </div>
</div>
</div>`
    ).join('')

    setInnerHTML(modalContent, modalResultHtml);
    setModal(true);
};

