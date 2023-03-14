'use strict';

const search = document.querySelector('.search');
const searchButton = document.querySelector('.send-button');
const searchResult = document.querySelector('.search-result');

async function fetchingRepositories(search) {
	const response = await fetch(`https://api.github.com/search/repositories?q=${search}`);
	const listOfRepositories = [];

	if (response.ok) {
		const data = await response.json();

		for (let i = 0; i < data.items.length - 20; i++) {
			listOfRepositories.push({
				fullName: data.items[i]['full_name'],
				url: data.items[i]['html_url'],
				desc: data.items[i]['description'],
				stars: data.items[i]['stargazers_count'],
				language: data.items[i]['language'],
			});
		}
	}

	return listOfRepositories;
}

function createListOfRepositories(title, url, description, starsCount, language) {
	const searchItem = document.createElement('section');
	searchItem.classList.add('search-item');

	searchItem.innerHTML = `
		<div class='title'><a href='${url}' target="_blank">${title}</a></div>
		<div class=''description>${description || ''}</div>
		<div class='footer'>
			<img src="./assets/icons8-star-50.png" alt="" width='15px' height='15px'/>
			<div class='stars-count'>${starsCount}</div>
			<div class='language'>Language: ${language || ''}</div>
		</div>
	`;

	searchResult.append(searchItem);
}

function clearSearchArea() {
	const searchItems = document.querySelectorAll('.search-item');
	const deleteItem = document.querySelector('.not-found');
	if (searchItems) {
		searchItems.forEach(item => {
			item.remove();
		});
	}
	if (deleteItem) {
		deleteItem.remove();
	}
}

function validInput(searchList) {
	let notFoundElement = document.createElement('div');
	notFoundElement.classList.add('not-found');
	notFoundElement.innerHTML = 'Ничего не найдено!';
	searchResult.append(notFoundElement);
}

searchButton.addEventListener('click', async () => {
	let searchValue = search.value;
	const searchList = await fetchingRepositories(searchValue);

	clearSearchArea();

	if (!searchList.length) {
		validInput(searchList);
	}

	searchList.forEach(item => {
		createListOfRepositories(item.fullName, item.url, item.desc, item.stars, item.language);
	});
});

search.addEventListener('keydown', async event => {
	if (event.key === 'Enter') {
		let searchValue = search.value;
		const searchList = await fetchingRepositories(searchValue);

		clearSearchArea();

		if (!searchList.length) {
			validInput(searchList);
		}
		searchList.forEach(item => {
			createListOfRepositories(item.fullName, item.url, item.desc, item.stars, item.language);
		});
	}
});
