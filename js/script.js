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

const renderCard = (data) => {
    newsList.textContent = '';

    data.forEach(news => {
        const card = document.createElement('li');
        card.className = 'news-item';

        card.innerHTML = `
                        <img src="${news.urlToImage}" alt="${news.title}" class="news-image" width="270" height="200">

                        <h3 class="news-title">
                            <a href="${news.url}" class="news-link" target="_blank">${news.title}</a>
                        </h3>
                        <p class="news-description">${news.description}</p>
                        <div class="news-footer">
                            <time class="news-datetime" datetime="${news.publishedAt}">
                                <span class="news-date">${news.publishedAt}</span> 11:06
                            </time>
                            <div class="news-author">${news.author}</div>
                        </div>
        `;
        newsList.append(card);
    })
};

const loadNews = async (country) => {
    newsList.innerHTML = "<li class='preload'></li>";
    country = localStorage.getItem('country') || 'ru';
    choices.setChoiceByValue(country);

    const data = await getdata(`https://newsapi.org/v2/top-headlines?country=${country}&pageSize=100&category=science`);
    renderCard(data.articles);
};

choicesElem.addEventListener('change', (event) => {
    const value = event.detail.value;
    localStorage.setItem('country', value);
    loadNews(value);
});

const loadSearch = async (value) => {
    const data = await getdata(`https://newsapi.org/v2/everything?q=${value}`);
    title.textContent = `По вашему запросу “${value}” найдено ${data.articles.length} результатов`;
    renderCard(data.articles);
}

formSearch.addEventListener('submit', event => {
    event.preventDefault();
    loadSearch(formSearch.search.value);
    formSearch.reset();
})

loadNews();