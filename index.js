class App {

    constructor() {
        this.notebooks = [];
        this.entryList = document.querySelector('#entry-list')
        this.currentNotebookId = -1;
        this.openNotebookId = -1;
        this.openNotebook = null;

        //Find notebook template
        this.notebookTemplate = document.querySelector('#notebook-template')

        //Find entry template
        this.entryTemplate = document.querySelector('#entry-template')

        //Add notebook submit listener
        document.querySelector('#add-notebook-form')
                .addEventListener('submit', this.addNotebook.bind(this))

        //Add entry submit listner
        document.querySelector('#add-entry-form')
                .addEventListener('submit', this.addEntry.bind(this))
    }

    //Adds a new notebooks
    addNotebook(event) {
        event.preventDefault()
        console.log("add notebook")

        this.currentNotebookId++

        //Create notebook from form
        const form = event.target
        const notebookName = form.notebookName.value
        const newNotebook = new Notebook(notebookName, this.currentNotebookId)

        //Add notebook to array
        this.notebooks.push(newNotebook)

        //Create notebook element
        const notebookDOM = this.renderNotebook.bind(this)(newNotebook)

        //Add notebook to DOM
        document.querySelector('#entry-list').appendChild(notebookDOM)
    }

    //Creates notebook DOM
    renderNotebook(notebook) {
        const notebookDOM = this.notebookTemplate.cloneNode(true)

        //Remove template class and change id
        notebookDOM.classList.remove('template')
        notebookDOM.setAttribute('id', 'n' + notebook.id)

        //Add notebook information
        notebookDOM.textContent = notebook.name

        //Add event listener for changing notebooks
        notebookDOM.addEventListener('click', this.changeNotebook.bind(this, notebook))

        return notebookDOM
    }

    //Changes current notebook and reloads entry list
    changeNotebook(notebook, event) {

        //remove current-notebook class from previous notebook
        if(this.openNotebookId != -1) {
            let previousNotebook
            for(let i = 0; i < this.notebooks.length; i++) {
                if (this.notebooks[i].id === this.openNotebookId) {
                    previousNotebook = this.notebooks[i]
                }
            }
            const previousNotebookDOM = document.querySelector('#n' + previousNotebook.id)
            previousNotebookDOM.classList.remove('current-notebook')
        }
        //add current-notebook class to new notebook
        this.openNotebook = notebook
        const openNotebookDOM = document.querySelector('#n' + this.openNotebook.id)
        openNotebookDOM.classList.add('current-notebook')
        this.openNotebookId = this.openNotebook.id

        //Reload journal entries
        //TODO
    }

    //Adds a new journal entry to current notebook
    addEntry(event) {
        event.preventDefault()
        console.log("add note")
    }

    //Save notebooks to local storage
    save() {
        
    }

    //Load notebooks from local storage
    load() {

    }

}

class Notebook {

    constructor(name, id) {
        this.name = name
        this.id = id
        this.entries = []
        this.isCurrentNotebook = false
    }

    addEntry(date, content, id) {

        newEntry = new Entry(date, content, id)

    }

}

class Entry {

    constructor(date, content, id) {
        this.date = date
        this.content = content
        this.id = id
    }

}

//Start application
const app = new App()