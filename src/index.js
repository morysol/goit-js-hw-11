import './sass/main.scss';
import { parsePictures } from './js/parse';
import PicturesApiService from './js/url';
import { makePicturesUI } from './js/makeMarkup';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-aio-3.2.5.min.js';

import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;

const inputForm = document.querySelector('#search-form');
const picturesGallery = document.querySelector('.gallery');

window.addEventListener('scroll', debounce(onScroll, DEBOUNCE_DELAY));
function onScroll(e) {
  if (
    document.documentElement.scrollHeight - document.documentElement.scrollTop <=
    document.documentElement.clientHeight + 5
  ) {
    picturesApiService.currentPage += 1;
    picturesApiService
      .fetchURL()
      .then(isPicturesOver)
      .then(parsePictures)
      .then(makePicturesUI)
      .then(drawPictures)
      .then(smoothScroll)
      .catch(function (error) {
        // handle error
        //
        if (error?.response?.status === 400) {
          Notiflix.Notify.failure('Page is out of valid range');
          picturesApiService.currentPage -= 1;
        }

        if (error?.data?.hits?.length === 0) {
          Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
          picturesApiService.currentPage -= 1;
        }
      });
  }
}

let gallery = new SimpleLightbox('.gallery a');
gallery.on('show.simplelightbox', function () {
  // do something…
});

const picturesApiService = new PicturesApiService();

inputForm.addEventListener('submit', onSubmitForm);

function onSubmitForm(e) {
  e.preventDefault();
  //   console.log(e);

  const inputedValue = e.currentTarget.searchQuery.value;
  if (!inputedValue) {
    return;
  }
  cleanGallery();

  picturesApiService.query = inputedValue;
  picturesApiService.currentPage = 1;

  picturesApiService
    .fetchURL()
    .then(matchQuery)
    .then(parsePictures)
    .then(makePicturesUI)
    .then(drawPictures)
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  e.target.reset();
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function isPicturesOver(response) {
  if (response.data.hits.length === 0) {
    throw response;
  }
  return response;
}

function matchQuery(response) {
  if (response.data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    throw 'no images were found';
  }
  Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
  return response;
}

function drawPictures(markUp) {
  picturesGallery.insertAdjacentHTML('beforeend', markUp);
  gallery.refresh();
}

function cleanGallery() {
  picturesGallery.innerHTML = '';
}
