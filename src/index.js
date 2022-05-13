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
async function onScroll(e) {
  if (
    document.documentElement.scrollHeight - document.documentElement.scrollTop <=
    document.documentElement.clientHeight + 1
  ) {
    picturesApiService.currentPage += 1;
    try {
      const pics = await picturesApiService.fetchURL();
      const picsOk = await isPicturesOver(pics);
      showPictures(picsOk);
      smoothScroll();
    } catch (error) {
      if (error?.response?.status === 400) {
        Notiflix.Notify.failure('Page is out of valid range');
        picturesApiService.currentPage -= 1;
      }

      if (error?.data?.hits?.length === 0) {
        Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
        picturesApiService.currentPage -= 1;
      }
    }
  }
}

let gallery = new SimpleLightbox('.gallery a');
gallery.on('show.simplelightbox', function () {
  // do something…
});

const picturesApiService = new PicturesApiService();

inputForm.addEventListener('submit', onSubmitForm);

async function onSubmitForm(e) {
  e.preventDefault();

  const inputedValue = e.currentTarget.searchQuery.value;
  if (!inputedValue) {
    return;
  }

  cleanGallery();

  picturesApiService.query = inputedValue;
  picturesApiService.currentPage = 1;

  try {
    const pics = await picturesApiService.fetchURL();
    const picsOk = await matchQuery(pics);
    showPictures(picsOk);
  } catch (error) {
    console.log(error);
  }

  e.target.reset();
}

// is no pictures or query failed

async function isPicturesOver(response) {
  if (response.data.hits.length === 0) {
    throw response;
  }
  return response;
}

async function matchQuery(response) {
  if (response.data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    throw 'no images were found';
  }
  Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
  return await response;
}

// gallery render

function showPictures(picsOk) {
  const parsedPictures = parsePictures(picsOk);
  const picturesMarkup = makePicturesUI(parsedPictures);
  renderPictures(picturesMarkup);
}

function renderPictures(markUp) {
  picturesGallery.insertAdjacentHTML('beforeend', markUp);
  gallery.refresh();
}

function cleanGallery() {
  picturesGallery.innerHTML = '';
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
