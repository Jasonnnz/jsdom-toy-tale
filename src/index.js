let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('form');
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  loadToys();
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  // const createToyBtn = document.querySelector('input[name="submit"]');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const toyName = document.querySelector('input[name="name"]').value;
    const toyUrl = document.querySelector('input[name="image"]').value;
    const numOfCurrentToys = document.querySelectorAll('.card').length;
    let toyLikes = 0;
    let toyObject = {
      "name": toyName,
      "image": toyUrl,
      "likes": toyLikes,
      "id": numOfCurrentToys + 1
    };
    renderToy(toyObject);
    addToDB(toyObject);
    e.target.reset();
    // e.target.closest('.add-toy-form').reset();
  })
  const toyCollection = document.querySelector('div#toy-collection');
  toyCollection.addEventListener("click", function(e){
    if (e.target.className === "like-button"){
      const card = e.target.closest('.card');
      let numOfLikesTag = card.querySelector('p');
      numOfLikesTag.textContent = parseInt(numOfLikesTag.textContent) + 1;
      let likeCount = numOfLikesTag.textContent;
      let toyId = card.dataset.id;
      //function to patch to DB
      updatesDB(toyId, likeCount);
    }
  })
  
});

function loadToys() {
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(arrOfToys => {
      arrOfToys.forEach(toyObj => renderToy(toyObj));
    })
}

function renderToy(toyObj){
  const divCollection = document.querySelector('div#toy-collection');
  const div = document.createElement('div');
  div.className = "card";
  div.dataset.id = toyObj.id;
  const h2 = document.createElement('h2');
  const img = document.createElement('img');
  const p = document.createElement('p');
  const btn = document.createElement('button');
  btn.className = "like-button";
  img.className = "toy-avatar";
  h2.textContent = toyObj.name;
  img.src = toyObj.image;
  p.textContent = toyObj.likes;
  btn.textContent = "Like";
  div.append(h2, img, p, btn);
  divCollection.append(div);
}

function addToDB(toyObject){
  fetch('http://localhost:3000/toys', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toyObject),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
}

function updatesDB(toyId, newLikes){
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: "application/json"
    },
    body: JSON.stringify({
      "likes": newLikes
    })
  })
}

