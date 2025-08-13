"use strict";

// Создаем элементы
const inputField = document.querySelector('.input-field');
const dropDownMenu = document.querySelector('.dropdown-menu');
const listRepository = document.querySelector('.list-repository');

// Функция для создания элемента списка репозиториев
function createElemOfList(elem) {
    const elemOfListRepository = document.createElement('div');
    elemOfListRepository.className = 'repository-item';

    const elemForText = document.createElement('div');
    elemForText.className = 'repository-text';

    const name = document.createElement('p');
    const owner = document.createElement('p');
    const stars = document.createElement('p');

    name.textContent = `Name: ${elem.dataset.name}`;
    owner.textContent = `Owner: ${elem.dataset.owner}`;
    stars.textContent = `Stars: ${elem.dataset.stars}`;

    const btn = document.createElement('button');
    btn.className = 'close-btn';
    btn.dataset.btn = 'true';

    elemForText.append(name, owner, stars);
    elemOfListRepository.append(elemForText, btn);

    return elemOfListRepository;
}

// Функция для создания элемента выпадающего меню
function createItemMenu(name) {
    const itemMenu = document.createElement('div');
    itemMenu.className = 'dropdown-item';
    itemMenu.textContent = name;
    return itemMenu;
}

// Функция для задержки запроса
function debounce(fn, ms) {
    let timeout = null;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), ms);
    }
}

// Функция запроса на сервер по имени репозитория
function requestRepository(value) {
    return fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`)
        .then(response => response.json())
        .then(repositories => {
            const arr = [...repositories.items];
            addMenu(arr);
            return repositories.items;
        })
        .catch(err => console.error(err));
}

// Функция добавления данных запроса в выпадающее меню
function addMenu(arr) {
    dropDownMenu.innerHTML = '';

    if (arr.length === 0) {
        const elem = createItemMenu('Репозитории отсутсвуют');
        dropDownMenu.append(elem);
        dropDownMenu.style.display = 'block';
        return;
    }

    arr.forEach((repository) => {
        const elem = createItemMenu(repository.name);
        elem.setAttribute('data-item-menu', 'true');
        elem.setAttribute('data-name', `${repository.name}`);
        elem.setAttribute('data-owner', `${repository['owner']['login']}`);
        elem.setAttribute('data-stars', `${repository['stargazers_count']}`);
        dropDownMenu.append(elem);
        dropDownMenu.style.display = 'block';
    });
}

// Функция запроса с установленной задержкой
const requestRepositoryDebounce = debounce(requestRepository, 500);

// Слушатель события введения букв в поле ввода
inputField.addEventListener('input', () => {
    // if (inputField.value !== '') {
    //     requestRepositoryDebounce(inputField.value);
    // } else {
    //     dropDownMenu.innerHTML = '';
    // }
    if (inputField.value === '') {
        dropDownMenu.innerHTML = '';
        return;
    }
    requestRepositoryDebounce(inputField.value);
});

// Слушатель события click на всем документе с использованием делегирования
document.addEventListener('click', (event) => {
    let target = event.target;

    if (target.dataset.itemMenu) {
        const newElemOfList = createElemOfList(event.target);
        listRepository.append(newElemOfList);
        inputField.value = '';
        dropDownMenu.innerHTML = '';
    }

    if (target.dataset.btn) {
        target.parentElement.remove();
    }
});