import search from './js/search-api.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.c-form');
const gallery = document.querySelector('.gallery');

let page = 1;

function createGallery(images) {
  const markup = images
    .map(image => {
      const {
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `
        <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery-item" id="${id}">
            <img class="gallery-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

form.addEventListener('submit', onSubmitClick);

function onSubmitClick(e) {
  e.preventDefault();
  page = 1;
  query = form[0].value;
  gallery.innerHTML = '';

  if (query === '') {
    Notiflix.Notify.failure('The search cannot be empty.');
    return;
  }

  search(query, page)
    .then(ress => {
      if (ress.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images. Please try again.'
        );
      } else {
        createGallery(ress.hits);
        simpleLightBox = new SimpleLightbox('.gallery a', {
          captionsData: 'alt',
          captionDelay: 250,
        });
        Notiflix.Notify.success(
          `We found ${ress.totalHits} images of ${query}.`
        );
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      form.reset();
    });
}

function onloadMore() {
  page += 1;
  simpleLightBox.destroy();

  search(query, page)
    .then(data => {
      createGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a');

      const totalPages = Math.ceil(data.totalHits / 40);

      if (page > totalPages) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}

function checkIfEndOfPage() {
  return (
    window.innerHeight + window.pageYOffset >=
    document.documentElement.scrollHeight
  );
}

function showMorePage() {
  if (checkIfEndOfPage()) {
    onloadMore();
  }
}

window.addEventListener('scroll', showMorePage);
