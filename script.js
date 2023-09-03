const table = document.querySelector('table')

let students = []

class student {
  constructor(name = '', number, age, math = 0, since = 0, history = 0) {
    this.name = name
    this.number = Number.isInteger(number) ? number : console.error('number must be integer value 0,1,2,3.... ')
    this.age = age
    this.math = math
    this.since = since
    this.history = history
  }

}

// -------------------------------------------------------------- Custom Select -----------------------------------------
const slctparents = document.querySelectorAll('.custom-select');

[...slctparents].forEach(label => {
  label.addEventListener('mousedown', (e) => {
    // hide original dropdown list 
    e.preventDefault()
    const select = label.children[0];
    const ul = document.createElement('ul');
    ul.classList.add('dropdown-list');

    [...select.children].forEach((option) => {

      const li = document.createElement('li')
      li.textContent = option.textContent

      li.addEventListener('mousedown', e => {

        e.stopPropagation()
        select.value = option.value
        // trigger change event on the select
        select.dispatchEvent(new Event('change'))
        ul.remove()
      })

      ul.appendChild(li)

    })
    label.appendChild(ul)
    // click out handle
    document.addEventListener('click', e => {
      if (!label.contains(e.target)) ul.remove()
    })

  })
});

// end custom select
//-------------------------------------------------Popup Form -----------------------------------------------------

const popup = document.querySelector('.popup')
const openPopupBtn = document.querySelector('.open-popup')
const closePopupBtn = document.querySelector('.close-popup')
const insertStudentForm = document.getElementById('insert-student')

popup.remove()

openPopupBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  document.body.append(popup)
  document.body.style.cssText = 'overflow:hidden'
  scrollTo(0, 0)
  setTimeout(() => {
    insertStudentForm.classList.add('show')
  }, 0);
  document.querySelector('.popup .row input').focus()
  document.addEventListener('click', (e) => {
    if (!insertStudentForm.contains(e.target)) {
      document.body.style.cssText = 'overflow:auto'
      insertStudentForm.classList.remove('show')
      insertStudentForm.reset()
      popup.remove()
    }
  })
})

closePopupBtn.addEventListener('click', (e) => {
  document.body.style.cssText = 'overflow:auto'
  insertStudentForm.reset()
  insertStudentForm.classList.remove('show')
  popup.remove()
})

insertStudentForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const [name, number, age, math, since, history] = [...document.querySelectorAll('.popup .row input')]
  const result = insertStudent(name.value, +number.value, +age.value, +math.value, +since.value, +history.value)
  if (result.hasInserted) {
    insertStudentForm.reset()
    document.body.style.cssText = 'overflow:auto'
    popup.remove()
    return
  }
  window.alert(result.errMessage)

})

// End Popup 
//------------------------------------------------- Hide failed students ------------------------------------------
const hideFailedStudentsBtn = document.getElementById('hide-failed')
hideFailedStudentsBtn.addEventListener('click', (e) => {
  if(students.length==0) return
  students.forEach((student, i) => {
    if (!checkSuccess(student.number).passed){
      document.querySelector(`table tbody tr:nth-child(${i+1})`).classList.toggle('hide')
    }
  })
})
//------------------------------------------- Highlighting Max Grade Students -------------------------------------

const maxStudentsForm=document.getElementById('max-students')
const maxStudentsSelect=document.querySelector('form#max-students .custom-select select')
maxStudentsForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  //remove old highlights & show hidden students 
  document.querySelectorAll('table tbody tr').forEach((row)=>row.classList.remove('active','hide'))
  const indexes=calcMax(maxStudentsSelect.value)
  indexes.forEach((i)=>{
    document.querySelector(`table tbody tr:nth-child(${i+1})`).classList.add('active')
  })

})
maxStudentsForm.addEventListener('reset',(e)=>{
  document.querySelectorAll('table tbody tr').forEach((row)=>row.classList.remove('active'))
})

// ------------------------------------------------ Get Avg Of Subject --------------------------------------------
const avgOfSubjectForm=document.getElementById('avg-subject')
const avgOfSubjectSelect=document.querySelector('form#avg-subject .custom-select select')
avgOfSubjectForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  document.querySelector('form#avg-subject .result').textContent=calcAvg(avgOfSubjectSelect.value).toFixed(2)

})
// ----------------------------------------------- Check if Student pass ------------------------------------------
const checkPassForm=document.getElementById('check-pass')
const checkPassNumber= document.querySelector('#check-pass .custom-input')
const checkPassResult =document.querySelector('#check-pass .result')
checkPassForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  const result =checkSuccess(Number.parseInt(checkPassNumber.value))
  if(result.passed===true){
    checkPassResult.textContent='Passed'
    checkPassResult.style.cssText='color:rgb(60, 203, 60)'
  }
  else if (result.passed===null)
  window.alert(result.err)  

// result.passed : flase 
  else {
    checkPassResult.textContent='Failed'
    checkPassResult.style.cssText='color:red'

  }
  checkPassNumber.value=""


})



//----------------------------------------------------- Functions -------------------------------------------------

function insertStudent(name = '', number = 0, age, math = 0, since = 0, history = 0) {
  //  vlaidation 
  if (typeof name !== typeof '')
    return { hasInserted: false, errMessage: `Name '${name}' :Is Not a String, Name Must Be String Value ` }

  if (!checkRange(18, 40, age))
    return { hasInserted: false, errMessage: `insertStudent : ${age} Is Not Valid Age, Age Must Be Between 18 and 40` }

  if (!(checkRange(0, 100, math) && checkRange(0, 100, since) && checkRange(0, 100, history)))
    return { hasInserted: false, errMessage: 'insertStudent : Student Marks (History, Math, Since) Must Be Between 0-100 ' }

  if (Number.isInteger(number)) {
    if (students.some((el) => el.number == number)) {
      return { hasInserted: false, errMessage: `insertStudent :The Number (${number}) Is Already Exist Chose Another Number` }
    }
  }
  else {
    return { hasInserted: false, errMessage: `insertStudent : ${number} Number Must Be Integer Value 1,2,3....` }
  }

  // name format 
  name = name[0].toUpperCase() + name.slice(1).toLowerCase()

  let index2 = 0
  while (index2 < students.length && students[index2].name < name) index2++
  // let index3=students.findIndex((el)=>el.name>name)
  const newStudent = [name, number, age, math, since, history]
  students = students.slice(0, index2).concat(new student(...newStudent), students.slice(index2))
  const targetTr = document.querySelector(`table tbody tr:nth-child(${index2 + 1})`)
  if (targetTr!==null) {
    const newTr = targetTr.cloneNode(true);
    [...newTr.children].forEach((td, i) => {
      td.textContent = newStudent[i]
    })
    newTr.classList.remove('hide')
    targetTr.before(newTr)
    console.log(index2,'index 2 ')
  }
  else {
    // empty table or new row order is last one
    document.getElementsByTagName('tbody')[0].innerHTML+=`
   <tr >
        <td>${newStudent[0]}</td>
        <td>${newStudent[1]}</td>
        <td>${newStudent[2]}</td>
        <td>${newStudent[3]}</td>
        <td>${newStudent[4]}</td>
        <td>${newStudent[5]}</td>
  </tr>`
  }
  return { hasInserted: true, errMessage: '' }
}

function calcAvg(subject = '') {
  let subjects = ['math', 'since', 'history']
  subject = subject.toLowerCase()
  if (students.length === 0 || subjects.indexOf(subject) < 0) {
    console.error(`calcAvg : Incorrect Subject Name Or Empty Students Array`)
    return '-'
  }

  let sum = 0, i = 0
  for (; i < students.length; i++)
    sum += students[i][`${subject}`]

  console.log(`%cAVG %cof ${subject} Marks For All Students is %c${sum / i}`, 'color:rgb(255,100,100);font-size:16px', 'text-transform:capitalize', 'color:rgb(100,255,100)')
  return sum / i
}

function calcMax(subject = '') {
  let subjects = ['math', 'since', 'history']
  subject = subject.toLowerCase()
  if (students.length === 0 || subjects.indexOf(subject) < 0) {
    console.error(`cacMax : Incorrect Subject Name Or Empty Students Array `)
    return null
  }
  let maxMark = Math.max(...students.map((stu) => stu[`${subject}`]))
  let maxStudentsIndexes =[]
  students.forEach((student,i)=>{
    if(student[`${subject}`]===maxMark)
    maxStudentsIndexes.push(i)
  })
  console.log(maxStudentsIndexes)
  return maxStudentsIndexes
}

function checkSuccess(number = -1) {
  if(!Number.isInteger(number)) return{passed:null,err:` value you intered (${number}) not an integer`}
  //                  returns element or undefined
  let stud = students.find((stu) => stu.number == number)

  if (!stud) {
    return {passed:null,err:`number you entered (${number}) not exist`}
  }
  //         condition one                                                    condition two 
  if (stud.math >= 50 && stud.history >= 50 && stud.since >= 50 && (stud.math + stud.since + stud.history) / 3 >= 60) {
    console.log(`%c${stud.name}%c Success`, 'color:rgb(250,100,100);font-size:16px;text-transform:capitalize', 'color:rgb(100,255,100)')
    return {passed:true,err:''}
  }
  console.log(`%c${stud.name}%c Failed`, 'color:rgb(250,100,100);font-size:16px;text-transform:capitalize', 'color:rgb(255,100,100)')
  return {passed:false,err:''}
}

function checkRange(start = 0, end = 0, num) {
  if (num >= start && num <= end) return true
  return false
}
// ----------------------------------------------------------------------------------------------------------------
insertStudent('ali', 1000, 19, 59, 50, 50)
insertStudent('zyaD', 300, 24, 49, 82, 80)
insertStudent('cat', 222, 22, 59, 60, 61)
insertStudent('belal', 333, 21, 89, 60, 87)
insertStudent('othman', 555, 28, 89, 50, 80)
insertStudent('Ameer', 666, 21, 76, 73, 90)
console.table(students)
calcAvg('MatH')
calcMax('history')
