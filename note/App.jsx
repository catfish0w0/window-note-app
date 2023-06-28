import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc} from "firebase/firestore"
import {db, notesCollection} from "./firebase"

export default function App() {
    const [notes, setNotes] = React.useState( []
        // 1st: setting up connection with DB in useState and useEffect
        // we are going to use the DB directly
        // we are now completely rely on the notes we have on the database;
        //() => JSON.parse(localStorage.getItem("notes")) || []
    )
    const [currentNoteId, setCurrentNoteId] = React.useState("")

    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]
    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)
    /*
        since we are no longer using localStorage,
        we are setting up a connection between React App and Firebase.
        so we are only doing this once => no dependency;
    */
    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
            // Sync up our local notes array with the snapshot data
           // one thing to know when interacting with database,
            // is that data we are getting back from firebase might not be the
            // same format that we are getting it.
            // For example, we are currently using nanoId, but for any DB that we work with
            // has the ability to generate id, so we are stopping to use it here.
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr)

        }) 
        // onSnapShot take two parameter, first collection that are taken
        // second parameter: callback function 
        // need to return a clean up function from use effect
        return unsubscribe

        /*
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes]
    */
    },[])

    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes]
    )


    // 2nd step: create new notes 
    async function createNewNote() {
        const newNote = {
            /// id: nanoid(), the DB gonna manage the id for us,
            // so just get rid of the nanoid here;
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        // instead of setting our notes manually, because on snapshot is going to take care of setting up the notes array;
        // setNotes(prevNotes => [newNote, ...prevNotes])
        
        // we just need to push the doc to fireStore
        const newNoteRef = await addDoc(notesCollection, newNote) // first parameter: collection, second parameter: newNote object;
        // addDoc return a promise, so we make it await;
        setCurrentNoteId(newNoteRef.id)
    }
    
    // 3rd: update notes function;
    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, {body : text, updatedAt: Date.now()}, {merge : true})
    }

    async function deleteNote(noteId) {
        // we are not going to manually delete everything, so just commented it out
        // setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
        
        // in order to delete on firestore, we first need to get the reference for the document which i am going to delete;
        const docRef = doc(db, "notes", noteId) // pass 3 parameter, first: db instance, second: name of the collection, third: delete note id
        // and this will give us the docRefference;
        // and we will use deleteDoc operation from firestore, and it will return a promise to us
        // so we will use async and await 
        await deleteDoc(docRef);

    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={notes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        <Editor
                            currentNote={currentNote}
                            updateNote={updateNote}
                        />

                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
