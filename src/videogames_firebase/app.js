
window.onload = () => {
    console.log("it works lol")
    console.log(db);

    $("i#search_icon").click(() => {
        $("div#search_box").toggleClass("hide");
    });

    // change event handler
    let searchInput = document.getElementById('vg_search')
    searchInput.addEventListener('input', e => {
        // console.log(e)
        let term = searchInput.value;
        console.log('search term', term)
        filterGameList(term)
    })
}

// DOM API
const ul = document.getElementById('vg_ul')
const vgForm = document.getElementById('vg_form')

const filterGameList = term => {

    //   remove all hide classes from li
    let liCollection = document.getElementsByTagName('li');
    console.log(liCollection.length)
    for (let i=0; i<liCollection.length; i++) {
        let li = liCollection[i];
        console.log(li)
        $(`#${li.id}`).removeClass('hide')
    }

    if (term.length > 2) {

        // do the filtering
        for (let i=0; i<liCollection.length; i++) {
            let li = liCollection[i];
            console.log(li)

            let title = $(`#${li.id} span`).text();
            console.log(title)
            if (title.toLowerCase().startsWith(term.toLowerCase())) {
                $(`#${li.id}`).removeClass('hide')
            } else {
                $(`#${li.id}`).addClass('hide')
            }
        }

    }

};


const showToast = (message, isSuccess) => {
    let background = isSuccess ?
        `linear-gradient(to right, ${'#107909'}, ${'#00ff60'})` :
        `linear-gradient(to right, ${'#791f09'}, ${'#ff5800'})`
    Toastify({
        text: message,
        duration: 3000,
        // destination: "https://github.com/apvarun/toastify-js",
        // newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: background,
        },
        onClick: function () {
        } // Callback after click
    }).showToast();
};

// add/edit game
vgForm.addEventListener('submit', e => {

    e.preventDefault(); // stop it from submitting the form!

    /*
        vg_developer
        "Rockstar"
        (string)


        vg_publisher
        "Rockstar"
        (string)


        vg_title
        "Grand Theft Auto 5"
        (string)


        vg_year
        "2013"
     */

    let vgTitle = vgForm.vg_title.value;
    let vgYear = vgForm.vg_year.value;
    let vgPublisher = vgForm.vg_publisher.value;
    let vgDeveloper = vgForm.vg_developer.value;
    console.log('form data', vgTitle, vgYear, vgPublisher, vgDeveloper)

    // input validation
    if (_.isEmpty(vgTitle) && _.isEmpty(vgYear) && _.isEmpty(vgPublisher) && _.isEmpty(vgDeveloper)) {
        showToast('All fields are required', false)
        return;
    }


    db.collection('videogames').add({
        'vg_developer': vgDeveloper,
        'vg_year': vgYear,
        'vg_publisher': vgPublisher,
        'vg_title': vgTitle
    });

    //  success (clear the form)
    vgForm.vg_title.value = '';
    vgForm.vg_year.value = '';
    vgForm.vg_publisher.value = '';
    vgForm.vg_developer.value = '';
    showToast('successfully added the game to the database', true);
})


// render game
const renderGame = doc => {

    //  get the data
    let docId = doc.id;
    let docObject = doc.data()

    // <li className="collection-item">
    let li = document.createElement('li');
    li.className = 'collection-item';
    // li.id = docId
    li.setAttribute('id', docId)
    li.setAttribute('data-id', docId)

    //     <i className="material-icons secondary-content red-text" title="click me to delete">delete</i>
    let deleteI = document.createElement('i');
    deleteI.className = 'material-icons secondary-content red-text'
    deleteI.title = 'click me to delete'
    deleteI.textContent = 'delete'
    deleteI.addEventListener('click', e => {
        e.stopPropagation();

        // get the ID
        let id = e.target.parentElement.getAttribute('data-id');
        console.log(`clicked -> ${id}`)

        // delete from google
        db.collection('videogames').doc(id).delete()
        showToast('successfully deleted the game', true)
    })

    //     <i className="material-icons secondary-content blue-text" title="click me to edit">edit</i>
    let editI = document.createElement('i');
    editI.className = 'material-icons secondary-content blue-text'
    editI.title = 'click me to edit'
    editI.textContent = 'edit'

    //     <span className="title">Red Dead Redemption</span>
    let span = document.createElement('span');
    span.className = 'title'
    span.textContent = `${docObject.vg_title}`

    //     <p className="grey-text">Rockstar (2009)</p>
    let p = document.createElement('p')
    p.className = 'grey-text'
    p.textContent = `${docObject.vg_publisher}/${docObject.vg_developer} (${docObject.vg_year})`

    // </li>

    // append the children
    li.append(deleteI)
    li.append(editI)
    li.append(span)
    li.append(p)
    // console.log(li)

    ul.appendChild(li);
};

// get games (one time load)
// db.collection('videogames').get().then(
//     snapshot => {
//         // console.log(snapshot)
//         console.log(`number of docs in collection: ${snapshot.docs.length}`)
//         snapshot.docs.forEach(
//             doc => {
//                 console.log(doc.id)
//                 console.log(doc.data())
//                 renderGame(doc)
//             }
//         );
//     }
// );

// get games (using snapshots)
db.collection('videogames').onSnapshot(
    snapshot => {
        // console.log(snapshot)

        // drill down and look at the changes
        let changes = snapshot.docChanges()
        console.log(changes)
        changes.forEach(
            change => {
                console.log(change.type)

                // console.log(change)
                switch (change.type) {
                    case 'added':
                        renderGame(change.doc)
                        break;
                    case 'removed':
                        // find the LI to remove

                        // query by ID
                        // let removeLi = document.getElementById(change.doc.id);
                        let removeLi = document.querySelector(`[data-id=${change.doc.id}]`)
                        ul.removeChild(removeLi);
                        break;
                    case 'modified':
                        // document is edited!

                        // TODO for practice
                        break
                }
            }
        );

    }
);
