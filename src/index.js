let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  //DOM elements
  const toyCollectionEl = document.getElementById('toy-collection')
  const formEl = document.querySelector('.add-toy-form')

  // api
  const toysURL = 'http://localhost:3000/toys'

  //render function
  function renderToys(toys, DOMEl){
    toys.forEach(toy=>{
      const div = document.createElement('div')
      div.className='card'
      div.innerHTML=`
        <h2>${toy.name}</h2>
        <img src=${toy.image} class = 'toy-avatar'/>
        <p>${toy.likes} Likes</p>
        <button type="button" class='like-btn' id=${toy.id}>Like ❤️</button> 
      `
      DOMEl.appendChild(div)
      div.querySelector('.like-btn').addEventListener('click', (e)=>{
        e.preventDefault()
        e.stopPropagation()
        toy.likes+=1
        div.querySelector('p').innerText=`${toy.likes} Likes`
        updateToyDb(toy)
      })
    })
  }

  //update functions
  async function updateToyDb(toyObj){
    const configObj = {
      method: 'PATCH',
      headers:{
        'Content-Type':'application/json',
        'Accept': 'application/json'
      },
      body:JSON.stringify(toyObj)
    }
    try{
      const res = await fetch(`http://localhost:3000/toys/${encodeURIComponent(toyObj.id)}`, configObj)
      const data = await res.json()
      console.log(data)
    }catch(error){console.log(error)}
  }

  //add new toy function
  async function addNewToy(toyObj){
    const configObj = {
      method: 'POST',
      headers:{
        'Content-Type':'application/json',
        'Accept': 'application/json'
      },
      body:JSON.stringify(toyObj)
    }
    try{
      const res = await fetch(toysURL, configObj)
      const data = await res.json()
      console.log(data)
    }catch(error){
      console.error(error)
    }
  }

  function handleAddToy(e){
    let toyObj={
      name:e.target.elements.name.value,
      image:e.target.elements.image.value,
      likes:0
    }
    addNewToy(toyObj)
  }

  //form submition
  function formSubmit(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault()
      handleAddToy(e)
      form.reset()
    })
  }

  //fetch functions
  async function fetchToys(api){
    try{
      const res= await fetch(api)
      const dataToys = await res.json() 
      renderToys(dataToys, toyCollectionEl)
    }catch(error){
      console.error(error)
    }    
  }

  //function calls
  fetchToys(toysURL)
  formSubmit(formEl)

});
