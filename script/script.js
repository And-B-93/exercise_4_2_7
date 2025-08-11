"use strick"

//создать элементы для: поля ввода, выпадающего меню, списка репозиториев и всего контейнера
const inputField = document.createElement('input');
const dropDownMenu = document.createElement('div');
const listRepository = document.createElement('div');
const container = document.createElement('div');

inputField.style.width = '500px';
inputField.style.height = "61px"
inputField.placeholder = 'Имя репозитория';
inputField.style.marginTop = '62px';
inputField.style.marginLeft = '77px';
inputField.style.marginRight = '84px';
inputField.style.fontSize = '48px';

container.style.background = '#C4C4C4';
container.style.padding = '20px';
container.style.width = '661px';

dropDownMenu.style.display = 'none';

container.append(inputField, dropDownMenu, listRepository);

//функция для создания элемента списка репозиториев
function createElemOfList(elem) {
    const elemOfListRepository = document.createElement('div');
    elemOfListRepository.style.background = '#E27BEB';
    elemOfListRepository.style.border = '1px solid #7A7A7A';
    elemOfListRepository.style.display = 'flex';
    elemOfListRepository.style.justifyContent = 'space-between';
    elemOfListRepository.style.width = '503px';
    elemOfListRepository.style.height = '101px';
    elemOfListRepository.style.marginLeft = '77px';
    elemOfListRepository.style.fontSize = '24px';

    const elemForText = document.createElement('div');
    elemForText.style.overflow = 'hidden';
    elemForText.style.marginRight = '5px';
    elemForText.style.overflowWrap = 'break-word';

    const name = document.createElement('p');
    const owner = document.createElement('p');
    const stars = document.createElement('p');

    name.style.margin = '2px';
    name.style.width = '100%';

    owner.style.margin = '2px';
    owner.style.width = '100%';

    stars.style.margin = '2px';
    stars.style.width = '100%';

    name.textContent = `Name: ${elem.dataset.name}`;
    owner.textContent = `Owner: ${elem.dataset.owner}`;
    stars.textContent = `Stars: ${elem.dataset.stars}`;

    const btn = document.createElement('button');
    btn.style.width = '47px';
    btn.style.width = '47px';
    btn.style.color = 'red';
    btn.style.background = 'rgba(0, 0, 0, 0)';
    btn.style.fontSize = '15px';
    btn.style.marginTop = '31px';
    btn.style.marginRight = '34px';
    btn.style.padding = '0';
    btn.style.border = 'none';
    btn.style.backgroundImage = 'url("Vector5.png"), url("Vector6.png")';
    btn.style.backgroundRepeat = 'no-repeat'

    btn.dataset.btn = 'true';

    elemForText.append(name, owner, stars);
    elemOfListRepository.append(elemForText, btn);

    return elemOfListRepository;
}

//функция для создания элемента выпадающего меню
function createItemMenu(name) {
    const itemMenu = document.createElement('div');

    itemMenu.style.width = '500px';
    itemMenu.style.height = '44px';
    itemMenu.style.background = '#E3E3E3';
    itemMenu.style.border = '1px solid black';
    itemMenu.style.borderTop = '';
    itemMenu.style.overflow = 'hidden';
    itemMenu.style.marginLeft = '77px';
    itemMenu.style.fontSize = '30px';

    itemMenu.textContent = name;

    return itemMenu;
}

//функция для задержки запроса
function debounce(fn, ms) {
    let timeout = null;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), ms);
    }
}

//функция запроса на сервер по имени репозитория
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

//функция добавления данных запроса в выпадающее меню
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
    })
}

//функция запроса с установленной задержкой
const requestRepositoryDebounce = debounce(requestRepository, 500);

//слушатель события введения букв в поле ввода
inputField.addEventListener('input', () => {
    if (inputField.value !== '') {
        requestRepositoryDebounce(inputField.value);
    } else {
        dropDownMenu.innerHTML = '';
    }
})

//слушатель события click на всем документе с использованием делегирования
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
})

document.body.append(container);
