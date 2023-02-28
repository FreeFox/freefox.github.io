window.addEventListener("load", (event) => {
    db.collection("testcollection").onSnapshot((snapshot)=>{
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                rederDoc(change.doc.data(), change.doc.id);
            } else if (change.type === 'removed') {
                var elem = document.querySelector(`.element[data-id="${change.doc.id}"]`);
                elem.parentNode.removeChild(elem);
            }
        });
    });
});

document.getElementById('elements-container').addEventListener("click", (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (event.target.matches('.remove')) {
        var id = event.target.dataset.id;
        db.collection("testcollection").doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
});

document.querySelector('.add-form .add').addEventListener("click", (event) => {
    event.stopPropagation();
    event.preventDefault();

    var titleInput = document.querySelector(`input[name="title"]`);
    var contentInput = document.querySelector(`textarea[name="content"]`);

    addDoc(titleInput.value, contentInput.value);

    titleInput.value = '';
    contentInput.value = '';
});

function rederDoc({title, content}, id){
    document.getElementById('elements-container').innerHTML += `
        <div class="element" data-id=${id}>
            <h3>${title}</h3>
            <div>${content}</div>
            <a data-id=${id} class="remove" href="#">Remove</a>
        </div>
    `;
}

function addDoc(title, content) {
    db.collection("testcollection").add({title, content}).then(() => {
        console.log("Document successfully added!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}