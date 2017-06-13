class App {

    constructor() {
        this.notebooks = []
        this.entryList = document.querySelector('#entry-list')
        this.currentNotebookId = -1
        this.openNotebookId = -1
        this.openNotebook = null

        //Find notebook template
        this.notebookTemplate = document.querySelector('#notebook-template')

        //Find entry template
        this.entryTemplate = document.querySelector('#entry-template')

        //Add notebook submit listener
        document.querySelector('#add-notebook-form')
            .addEventListener('submit', this.addNotebook.bind(this))

        //Add delete notebook listener
        document.querySelector('#del-notebook')
            .addEventListener('click', this.deleteNotebook.bind(this))

        //Add entry submit listner
        document.querySelector('#add-entry-form')
            .addEventListener('submit', this.addEntry.bind(this))

        this.load.bind(this)()
    }

    //Adds a new notebooks
    addNotebook(event) {
        event.preventDefault()

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
        document.querySelector('#notebook-list').appendChild(notebookDOM)

        form.reset()

        this.save()
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
        //if first time selecting notebook, allow user to enter entry
        document.querySelector('#input').style.display = "initial"
        document.querySelector('#del-notebook').style.display = "initial"

        //remove current-notebook class from previous notebook
        if (this.openNotebookId != -1) {
            let previousNotebook
            for (let i = 0; i < this.notebooks.length; i++) {
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

        //wipe currently displayed entries
        document.querySelector('#entry-list').innerHTML = ""

        //Reload journal entries
        this.renderNotebookEntries.bind(this)(this.openNotebook)
    }

    //rerender dom and print to screen for each notebook entry
    renderNotebookEntries(notebook) {
        for (let i = 0; i < notebook.entries.length; i++) {
            const entryDOM = this.renderEntry(notebook.entries[i])
            const entryList = document.querySelector('#entry-list')
            entryList.insertBefore(entryDOM, entryList.firstChild)
        }
    }

    //Adds a new journal entry to current notebook
    addEntry(event) {
        event.preventDefault()

        //Create entry from form and add to notebook
        const form = event.target
        const entryContent = form.entryContent.value
        this.addEntryToNotebook(this.openNotebook, this.getDateString(), entryContent)

        //print to screen
        const entryDOM = this.renderEntry.bind(this)(this.openNotebook.entries[this.openNotebook.entries.length - 1])
        const entryList = document.querySelector('#entry-list')
        entryList.insertBefore(entryDOM, entryList.firstChild)

        form.reset()

        this.save()

    }

    getDateString() {
        const date = new Date()
        let dateString = ""
        dateString += date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
        dateString += " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        return dateString
    }

    //Adds an entry to the notebook object
    addEntryToNotebook(notebook, date, content) {
        const newEntry = new Entry(date, content, notebook.entries.length)
        notebook.entries.push(newEntry);
    }

    //Renders an entry
    renderEntry(entry) {
        const entryDOM = this.entryTemplate.cloneNode(true)

        //Remove template class and change id
        entryDOM.classList.remove('template')
        //entryDOM.setAttribute('id', 'n' + entry.entries.length)

        //Add notebook information
        entryDOM.querySelector('p.content').textContent = entry.content
        entryDOM.querySelector('.date').textContent = entry.date

        //Add event listener for editing
        entryDOM.querySelector('button.edit').addEventListener('click', this.edit.bind(this, entry))

        //Add event listener for deleting
        entryDOM.querySelector('button.delete').addEventListener('click', this.deleteEntry.bind(this, entry, entryDOM))

        return entryDOM
    }

    //deletes entry from list
    deleteEntry(entry, entryDOM, event) {
        if (confirm("Are you sure you want to delete this note?")) {


            //delete entry from notebook
            for (let i = 0; i < this.openNotebook.entries.length; i++) {
                if (this.openNotebook.entries[i].id === entry.id) {
                    this.openNotebook.entries.splice(i, 1)
                    break;
                }
            }

            //removes entry from DOM
            entryDOM.style.display = "none"

            this.save()
        }
    }

    //deletes current notebook
    deleteNotebook(event) {
        if (confirm("Are you sure you want to delete this notebook?")) {

            let i = 0;
            //delete entry from notebook
            for (i; i < this.notebooks.length; i++) {
                if (this.notebooks[i].id == this.openNotebookId) {
                    console.log("splicing")
                    this.notebooks.splice(i, 1)
                    break
                }
            }

            //removes entry from DOM
            console.log("deleting notebook n" + this.openNotebookId)
            document.querySelector('#n' + this.openNotebook.id).style.display = "none"
            this.openNotebook = null
            this.openNotebookId = -1
            document.querySelector('#entry-list').innerHTML = ""
            document.querySelector('#input').style.display = "none"

            //checks to see if notebook count is 0, and hides current buttons
            if (this.notebooks.length === 0) {
                document.querySelector('#del-notebook').style.display = "none"
            }
            this.save()
        }
    }

    //runs when user hits edit/save button
    edit(entry, event) {
        const entryDOM = event.target.closest('.entry')
        const content = entryDOM.querySelector('.content')

        if (content.isContentEditable) {
            //saving
            content.contentEditable = false
            entry.content = content.textContent
            entryDOM.querySelector('button').textContent = "Edit"
            this.save()
        } else {
            //editing
            content.contentEditable = true
            content.focus()
            entryDOM.querySelector('button').textContent = "Save"
        }
    }

    //Save notebooks to local storage
    save() {
        localStorage.setItem('notebooks', JSON.stringify(this.notebooks))
        localStorage.setItem('notebookId', this.currentNotebookId)
    }

    //Load notebooks from local storage
    load() {
        const newNotebookId = localStorage.getItem('notebookId')
        this.currentNotebookId = newNotebookId

        const notebooksJSON = localStorage.getItem('notebooks')
        const notebooksArray = JSON.parse(notebooksJSON)
        if (notebooksArray) {
            for (let i = 0; i < notebooksArray.length; i++) {
                //save to array
                this.notebooks.push(notebooksArray[i])

                //create notebookDOM and print
                const notebookDOM = this.renderNotebook.bind(this)(notebooksArray[i])
                document.querySelector('#notebook-list').appendChild(notebookDOM)
            }
        }

    }

}

class Notebook {

    constructor(name, id) {
        this.name = name
        this.id = id
        this.entries = []
        this.isCurrentNotebook = false
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