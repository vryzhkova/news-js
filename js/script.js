const API_KEY = 'a0d254b2b61f4e92894608914b153659';
const choicesElem = document.querySelector('.js-choice');
const newsList = document.querySelector('.news-list');
const title = document.querySelector('.title');
const formSearch = document.querySelector('.form-search');

const choices = new Choices(choicesElem, {
    searchEnabled: false,
    itemSelectText: '',
});

const getdata = async (url) => {
    const response = await fetch(url, {
        headers: {
            'X-Api-Key': API_KEY,
        }
    });

    const data = await response.json();
    
    return data;
};

const getDateCorrectFormat = (isoDate) => {
    const date = new Date(isoDate);
    const fullDate = date.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    const fullTime = date.toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return `<span class="news-date">${fullDate}</span> ${fullTime}`;
}

const getImage = url => new Promise((resolve) => {
    const image = new Image(270, 200);

    image.addEventListener('load', () => {
        resolve(image);
});

    image.addEventListener('error', () => {
        image.src = 'image/no-photo.jpg'
        resolve(image);
    });

    image.src = url || 'image/no-photo.jpg';
    image.className = 'news-image';
    return image;
});

const renderCard = (data) => {
    newsList.textContent = '';

    data.forEach(async({urlToImage, title, url, description, publishedAt, author}) => {
        const card = document.createElement('li');
        card.className = 'news-item';

        const image = await getImage(urlToImage);
        image.alt = title;
        card.append(image);

        card.insertAdjacentHTML('beforeend', `
                <h3 class="news-title">
                    <a href="${url}" class="news-link" target="_blank">${title}</a>
                </h3>

                <p class="news-description">${description  || ''}</p>

                <div class="news-footer">
                    <time class="news-datetime" datetime="${publishedAt}">
                        ${getDateCorrectFormat(publishedAt)}
                    </time>
                    <div class="news-author">${author || ''}</div>
                </div>
            `);

    newsList.append(card);
    })
};

const loadNews = async (country) => {
    newsList.innerHTML = "<li class='preload'></li>";
    country = localStorage.getItem('country') || 'ru';
    choices.setChoiceByValue(country);
    title.classList.add('hide');

    const data = await getdata(`https://newsapi.org/v2/top-headlines?country=${country}&pageSize=100&category=science`);
    renderCard(data.articles);
};

const loadSearch = async (value) => {
    const data = await getdata(`https://newsapi.org/v2/everything?q=${value}&pageSize=100`);
    title.classList.remove('hide');
    title.textContent = `По вашему запросу “${value}” найдено ${data.articles.length} результатов`;
    choices.setChoiceByValue('');
    renderCard(data.articles);
}

choicesElem.addEventListener('change', (event) => {
    const value = event.detail.value;
    localStorage.setItem('country', value);
    loadNews(value);
});

formSearch.addEventListener('submit', event => {
    event.preventDefault();
    loadSearch(formSearch.search.value);
    formSearch.reset();
})

loadNews();