

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

// costum select 
const slctparents = document.querySelectorAll('.custom-select');

[...slctparents].forEach(label => {
  label.addEventListener('mousedown', (e) => {
    // hide original dropdown list 
    e.preventDefault()
    if (e.target.hasAttribute('on')) return

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
    document.addEventListener('click',e=>{
      if(!label.contains(e.target)) ul.remove()
    })

  })
});


function insertStudent(name = '', number = 0, age, math = 0, since = 0, history = 0) {
  //  vlaidation 
  if (typeof name !== typeof '') {
    console.error(`Name '${name}' :Is Not a String, Name Must Be String Value `)
    return
  }
  if (!checkRange(18, 40, age)) {
    console.error(`insertStudent : ${age} Is Not Valid Age , Age Must Be Between 18 and 40`)
    return
  }
  if (!(checkRange(0, 100, math) && checkRange(0, 100, since) && checkRange(0, 100, history))) {
    console.error('insertStudent : Student Marks(History,Math,Since) Must Be Between 0-100 ')
    return
  }
  if (Number.isInteger(number)) {
    if (students.some((el) => el.number == number)) {
      console.error(`insertStudent : ${number} :Is Already Exist Chose Another Number`)
      return
    }
  }
  else {
    console.error(`insertStudent : ${number} Number Must Be Integer Value : 1,2,3....`)
    return
  }

  // name format 
  name = name[0].toUpperCase() + name.slice(1).toLowerCase()


  // to insert in correct location to an array there is 2 ways :
  // 1- push student then sort after each insert >> O(n), 
  /* 
  students.push(new student('mohammed', 1, 55, 69, 72))
  students.push(new student('ali', 2, 85, 60, 84))
  students.sort((a, b) => a.name < b.name ? -1 : 1)
  */
  // 2- (better) find the proper index to insert O(n)

  // 2.1 (short code & much processing) using filter not best practice because at least it will go through students list 2 times first one from filter and sec from indexOf
  let index = students.indexOf(students.filter((student) => student.name > name ? true : false)[0])

  // 2.2 (longer code & less processing ) using while loop is best practice(i found) becaouse we'll go thorgh list one time => O(n)
  let index2 = 0
  while (index2 < students.length && students[index2].name < name) index2++
  // 2.3 using array method findIndex 
  // let index3=students.findIndex((el)=>el.name>name)

  students = students.slice(0, index2).concat(new student(name, number, age, math, since, history), students.slice(index2))
}

function calcAvg(subject = '') {
  let subjects = ['math', 'since', 'history']
  subject = subject.toLowerCase()
  if (students.length === 0 || subjects.indexOf(subject) < 0) {
    console.error(`calcAvg : Incorrect Subject Name Or Empty Students Array`)
    return
  }

  let sum = 0, i = 0
  for (; i < students.length; i++)
    sum += students[i][`${subject}`]

  console.log(`%cAVG %cof ${subject} Marks For All Students is %c${sum / i}`, 'color:rgb(255,100,100);font-size:16px', 'text-transform:capitalize', 'color:rgb(100,255,100)')
  // return sum / i
}

function calcMax(subject = '') {
  let subjects = ['math', 'since', 'history']
  subject = subject.toLowerCase()
  if (students.length === 0 || subjects.indexOf(subject) < 0) {
    console.error(`cacMax : Incorrect Subject Name Or Empty Students Array `)
    return
  }
  let maxMark = Math.max(...students.map((stu) => stu[`${subject}`]))
  // this solution dose not work if the max mark duplicated 
  let maxStudents = students.filter((el) => el[`${subject}`] == maxMark)
  maxStudents.forEach((student) => console.log(`%c${student.name}%c has the max mark of ${subject} : %c${[`${maxMark}`]} `, 'color:rgb(255,100,100);font-size:16px;text-transform:capitalize;', 'text-transform:capitalize;', 'color:rgb(100,255,100)'))
}

function checkSuccess(number = -1) {
  //                  returns element or undefined
  let stud = students.find((stu) => stu.number == number)

  if (!stud) {
    console.error('CheckSuccess : number not exist ')
    return
  }
  //         condition one                                                    condition two 
  if (stud.math >= 50 && stud.history >= 50 && stud.since >= 50 && (stud.math + stud.since + stud.history) / 3 >= 60) {
    console.log(`%c${stud.name}%c Success`, 'color:rgb(250,100,100);font-size:16px;text-transform:capitalize', 'color:rgb(100,255,100)')
    return
  }
  console.log(`%c${stud.name}%c Failed`, 'color:rgb(250,100,100);font-size:16px;text-transform:capitalize', 'color:rgb(255,100,100)')
}

function checkRange(start = 0, end = 0, num) {
  if (num >= start && num <= end) return true
  return false
}
insertStudent('ahmed', 1, 19, 59, 50, 50)
insertStudent('zyaD', 3, 24, 49, 82, 80)
insertStudent('bAkr', 2, 22, 59, 60, 61)
insertStudent('othman', 5, 28, 89, 50, 80)
insertStudent('BeLal', 4, 25, 56, 50, 57)
insertStudent('Ameer', 6, 21, 76, 40, 90)
insertStudent('ameR', 20, 21, 65, 74, 62)
insertStudent('Yazeed', 19, 19, 59, 82, 70)
console.table(students)
calcAvg('MatH')
calcAvg('history')
calcAvg('sincE')
calcMax('since')
calcMax('math')
calcMax('history')
checkSuccess(19)
checkSuccess(3)
// validation tests
insertStudent(29, 2, 29, 60, 60, 60)
insertStudent('test', 2, 20, 60, 60, 60)
insertStudent('test', 11, 9, 60, 60, 60)
insertStudent('test2', 12, 20, 60, 60, 200)
calcAvg(' not a subject name')
calcMax('any')
checkSuccess(29)
