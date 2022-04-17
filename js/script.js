const choicesElem = document.querySelector('.js-choice');

console.log(choicesElem);

const choices = new Choices(choicesElem, {
    searchEnabled: false,
    itemSelectText: '',
});