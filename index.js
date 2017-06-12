class App {

    constructor() {
        this.notebooks = [];
        this.entryList = document.querySelector('#entry-list')
        this.currentNotebook = -1;

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

        //Create notebook from form
        const form = event.target
        const notebookName = form.notebookName
        const newNotebook = new Notebook(notebookName)

        //Add notebook to array
        this.notebooks.push(newNotebook)

        //Create notebook element

        //Add notebook to DOM

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
new App()