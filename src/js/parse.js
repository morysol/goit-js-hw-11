export function parsePictures(response) {
  return response.data.hits.map(arr => {
    const { id, tags, comments, views, likes, downloads, largeImageURL, webformatURL } = arr;
    return { id, tags, comments, views, likes, downloads, largeImageURL, webformatURL };
  });
}
