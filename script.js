"use strict";
(function() {

  const menuBtn = document.querySelector('.menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const sidebarContent = document.querySelector('.sidebar-content');
  const content = document.querySelector('.content');
  const randomCategorie = document.querySelector('#random');
  const category = document.querySelector('#categories');
  const searchText = document.querySelector('#jsearch');
  const searchJokeBtn = document.querySelector('#get-joke');


  const status = response => {
    if (response.status !== 200) {
      return Promise.reject(new Error(response.statusText))
    }
    return Promise.resolve(response)
  }
  const json = function (response) {
    return response.json()
  }
  const error = function(err) {
    console.log('Fetch problem: ' + err.message);
  };

  function dateTime(item) {
    const currentDate = Date.now();
    const newTime = currentDate - item;;
    const hours = (newTime / (1000 * 60 * 60)).toFixed(0);

    return hours;
  }

  function createCardJoke({id, url, value, updated_at, categories}) {
    const lastUpdate = dateTime(Date.parse(`${updated_at}`));

    const detectedJoke = document.createElement('div');
    detectedJoke.className = 'detected-joke';

    const iconUnlike = document.createElement('div');
    iconUnlike.className = 'icon unlike';
    iconUnlike.setAttribute('id', `${id}`);
    iconUnlike.setAttribute('data-save', '');
    
    const jokeInfo = document.createElement('div');
    jokeInfo.className = 'joke-info';

    const imgJoke = document.createElement('img');
    imgJoke.setAttribute('src', './image/message.svg');
  
    const jokeTextGeneral = document.createElement('div');
    jokeTextGeneral.className = 'joke-text-general';

    jokeTextGeneral.insertAdjacentHTML('beforeend', `
      <span class="id-joke">ID: <a href="${url}" class="link">${id} <img src="./image/link.svg" alt="link"></a></span>
    `)

    const pjokeText = document.createElement('p');
    pjokeText.className = 'joke-text';
    pjokeText.textContent = `${value}`;

    const divUpdateCategory = document.createElement('div');
    divUpdateCategory.className = 'update-category';

    const spanUpdateInfo = document.createElement('span');
    spanUpdateInfo.setAttribute('class', 'update-info');
    spanUpdateInfo.textContent = 'Last update: ' + lastUpdate + ' hours ago';

    detectedJoke.appendChild(iconUnlike);
    detectedJoke.appendChild(jokeInfo);

    jokeInfo.appendChild(imgJoke);
    jokeInfo.appendChild(jokeTextGeneral);
    jokeTextGeneral.appendChild(pjokeText);
    jokeTextGeneral.appendChild(divUpdateCategory);

    divUpdateCategory.appendChild(spanUpdateInfo);

    if (category.checked) {

      const jokeCategory = document.createElement('input');
      const label = document.createElement('label');

      jokeCategory.setAttribute('class', 'check-category');
      jokeCategory.setAttribute('type', 'checkbox');
      jokeCategory.setAttribute('name', `${categories}`);
      label.setAttribute('for', `${categories}`);
      label.textContent = `${categories}`;

      divUpdateCategory.appendChild(jokeCategory);
      divUpdateCategory.appendChild(label);
    }
    content.insertAdjacentElement('beforeend', detectedJoke);
  }

  function favouriteCardRender({url, id ,value, update_at}) {

    const favouriteJoke = document.createElement('div');
    favouriteJoke.className = 'favourite-joke';

    const iconLike = document.createElement('div');
    iconLike.className = 'icon like';
    iconLike.setAttribute('id', `${id}`);
    iconLike.setAttribute('data-save', '');
    
    const jokeInfo = document.createElement('div');
    jokeInfo.className = 'joke-info';

    const imgJoke = document.createElement('img');
    imgJoke.setAttribute('src', './image/message.svg');
  
    const jokeTextGeneral = document.createElement('div');
    jokeTextGeneral.className = 'joke-text-general';

    jokeTextGeneral.insertAdjacentHTML('beforeend', `
      <span class="id-joke">ID: <a href="${url}" class="link">${id} <img src="./image/link.svg" alt="link"></a></span>
    `)

    const pjokeText = document.createElement('p');
    pjokeText.className = 'joke-text';
    pjokeText.textContent = `${value}`;

    const divUpdateCategory = document.createElement('div');
    divUpdateCategory.className = 'update-category';

    const spanUpdateInfo = document.createElement('span');
    spanUpdateInfo.setAttribute('class', 'update-info');
    spanUpdateInfo.textContent = 'Last update: ' + `${update_at}`;

    favouriteJoke.appendChild(iconLike);
    favouriteJoke.appendChild(jokeInfo);

    jokeInfo.appendChild(imgJoke);
    jokeInfo.appendChild(jokeTextGeneral);
    jokeTextGeneral.appendChild(pjokeText);
    jokeTextGeneral.appendChild(divUpdateCategory);

    divUpdateCategory.appendChild(spanUpdateInfo);

    sidebarContent.insertAdjacentElement('beforeend', favouriteJoke);
  }

  function getRandom() {
    fetch('https://api.chucknorris.io/jokes/random')
    .then(status)
    .then(json)
    .then( data => {
      createCardJoke(data);
    })
    .catch(error);
  };

  function getCheckCategory(category) {
    fetch(`https://api.chucknorris.io/jokes/random?category=${category}`)
    .then(status)
    .then(json)
    .then( data => {
      createCardJoke(data);
    })
    .catch(error);
  };

  function checkedCheckBoxes() {
    const selectedCheckBoxes = document.querySelectorAll('.check-category:checked');
    const checkedValues = Array.from(selectedCheckBoxes).map(cb => cb.value);

    for(let i = 0; i < checkedValues.length ; i++) {
      getCheckCategory(checkedValues[i]);
    }
  }

  function getSearchText(query) {
    fetch(`https://api.chucknorris.io/jokes/search?query=${query}`)
    .then(status)
    .then(json)
    .then( data => {
      if (data.result.length === 0) {
        const para = document.createElement('p');
        para.textContent = 'No results to display!';
        content.insertAdjacentElement('beforeend', para)
      }

      for(let i = 0; i < data.result.length ; i++) {
        createCardJoke(data.result[i]);
        // likeChangeColor(data.result[i]);
      }
      searchText.value = '';
    })
    .catch(error);
  }

  function searchTerm() {

    if (!searchText.value || searchText.value.length < 2) {
      searchText.style.backgroundColor = '#FF6767';
      setTimeout(function() {
        searchText.style.backgroundColor = '';
      }, 2000);
      return;
    }
    const lowerCaseType = searchText.value.toLowerCase();

    getSearchText(lowerCaseType); 
  }

  function likeChangeColor() {
    document.addEventListener('click', function(event) {
    
      if (event.target.dataset.save != undefined) { 

        const elemLike = event.target; 
        const jokeBox = event.target.nextElementSibling; 
        const id = elemLike.getAttribute('id');
        const url = jokeBox.querySelector('.link').getAttribute('href'); 
        const value = jokeBox.querySelector('.joke-text').textContent;
        const updated_at = jokeBox.querySelector('.update-info').textContent;

        const cartData = {
          'id': id,
          'url': url,
          'value': value,
          'update_at': updated_at, 
        };

        if (elemLike.classList.contains('like')) {
          console.log('unLike');
          
          elemLike.classList.remove('like');
          elemLike.classList.add('unlike');
          localStorage.removeItem(id); 
          renderLocalStorage();
          
        } else if (elemLike.classList.contains('unlike')) {
          console.log('like');
          
          elemLike.classList.remove('unlike');
          elemLike.classList.add('like');
          localStorage.setItem(`${id}`, JSON.stringify(cartData));        
          
          renderLocalStorage();
        }  
      }
    }) 
  }

  function renderLocalStorage() {
    sidebarContent.innerHTML = '';

    for (let i = 0; i < localStorage.length; i++) {
      const saveCart = localStorage.getItem(localStorage.key(i));
      favouriteCardRender(JSON.parse(saveCart));
    }
  }

  function selectCategory(e) {
    e.preventDefault();

    if(randomCategorie.checked) {
      getRandom();
    } else if (category.checked) {
      checkedCheckBoxes();
      
    } else {
      searchTerm();
    }
  }

  function init() {

    dateTime();
    renderLocalStorage();
    likeChangeColor()

    searchJokeBtn.addEventListener('click', selectCategory);

    menuBtn.addEventListener('click', function(e) {
      e.preventDefault;
      this.classList.toggle('active');
      sidebarContent.classList.toggle('active');
      sidebar.classList.toggle('active');
      sidebar.classList.toggle('shadow');
    });
  }

  init();

})();
