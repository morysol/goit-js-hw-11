export function makePicturesUI(pictures) {
  const picturesUI = pictures
    .map(p => {
      return `
        <div class="thumb">
       <a href="${p.largeImageURL}" class="gallery__item" >
<div class="photo-card">
  <img src="${p.webformatURL}" alt="${p.tags}" loading="lazy" class="gallery__image"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${p.likes}
    </p>
    <p class="info-item">
      <b>Views</b>${p.views}
    </p>
    <p class="info-item">
      <b>Comments</b>${p.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${p.downloads}
    </p>
  </div>
</div>
</div>
         </a>`;
    })
    .join('');
  return picturesUI;
}
