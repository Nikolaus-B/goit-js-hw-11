import search from './js/search-api.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import createGallery from './js/renderPage.js';
import refs from './js/refs.js';
const { form, input, gallery } = refs;

let page = 1;
let query = '';
let simpleLightBox;

form.addEventListener('submit', onSubmitClick);

function onSubmitClick(e) {
  e.preventDefault();
  page = 1;
  query = input.value;
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
        window.addEventListener('scroll', showMorePage);

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
      simpleLightBox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
      });

      const totalPages = Math.ceil(data.totalHits / 40);

      const lastEL = document.querySelector('.gallery').lastChild;
      if (lastEL) {
        infinite.obverce(lastEL);
      }

      if (page > totalPages) {
        Notiflix.Notify.failure("You've reached the end of search results.");
      }
    })
    .catch(error => console.log(error));
}

// const infinite = new IntersectionObserver(([entry], observer) => {
//   if (entry.isIntersecting) {
//     observer.unobserve(entry.target);
//     onloadMore();
//   }
// });

function showMorePage() {
  if (
    window.innerHeight + window.pageYOffset >=
    document.documentElement.scrollHeight
  ) {
    onloadMore();
  }
}
