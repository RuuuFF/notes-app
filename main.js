const DOM = {
  html: document.querySelector('html'),
  addNoteBtn: document.getElementById('add'),
  themeBtn: document.getElementById('toggle-theme'),

  changeTheme() {
    DOM.html.classList.toggle('dark-theme')
    LocalStorage.saveTheme()
  }
}

const LocalStorage = {
  updateNotes() {
    const notesText = document.querySelectorAll('textarea')
    const notes = []
  
    notesText.forEach(note => note.value !== '' ? notes.push(note.value) : '')
  
    localStorage.setItem('notes', JSON.stringify(notes))
  },

  loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes'))
    notes ? notes.forEach(note => NotesApp.addNewNote(note)) : ''
  },

  saveTheme() {
    localStorage.setItem('theme', DOM.html.classList.contains('dark-theme') ? 'dark-theme' : '')
  },

  loadTheme() {
    if (localStorage.getItem('theme')) {
      DOM.html.classList.add(localStorage.getItem('theme'))
      DOM.themeBtn.checked = true
    }
  }
}

const NotesApp = {
  createNote(text) {
    const note = document.createElement('div')
    note.classList.add('note')

    note.innerHTML = `
      <div class="tools">
        <button class="edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="delete">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>

      <div class="main ${text ? "" : "hidden"}"></div>
      <textarea class="${text ? "hidden" : ""}"></textarea>
    `
    return note
  },

  getElementsOnNote(note) {
    const editBtn = note.querySelector('.edit')
    const deleteBtn = note.querySelector('.delete')
    const main = note.querySelector('.main')
    const textArea = note.querySelector('textarea')

    return { editBtn, deleteBtn, main, textArea }
  },

  deleteNote(note) {
    note.remove()
    LocalStorage.updateNotes()
  },

  editNote(main, textArea) {
    main.classList.toggle('hidden')
    textArea.classList.toggle('hidden')
    textArea.focus()
  },

  updateMainContent(event, main) {
    const { value } = event.target
    main.innerHTML = marked(value)
    LocalStorage.updateNotes()
  },

  addNewNote(text = '') {
    const note = NotesApp.createNote(text)
    const { editBtn, deleteBtn, main, textArea } = NotesApp.getElementsOnNote(note)

    textArea.value = text
    main.innerHTML = marked(text)

    deleteBtn.addEventListener('click', () => NotesApp.deleteNote(note))
    editBtn.addEventListener('click', () => NotesApp.editNote(main, textArea))
    textArea.addEventListener('input', event => NotesApp.updateMainContent(event, main))

    document.body.appendChild(note)
    textArea.focus()
    note.scrollIntoView()
  },

  start() {
    DOM.addNoteBtn.addEventListener('click', () =>  NotesApp.addNewNote())
    DOM.themeBtn.addEventListener('change', () => DOM.changeTheme())
    LocalStorage.loadNotes()
    LocalStorage.loadTheme()
  }
}

NotesApp.start()