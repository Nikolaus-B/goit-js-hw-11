import axios from 'axios';

const KEY = '39619229-fb57a8f6c3890e7ba1598bedf';

axios.defaults.baseURL = 'https://pixabay.com/api/';

async function search(searchName, page) {
  return await axios
    .get(
      `?key=${KEY}&q=${searchName}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    )
    .then(responce => responce.data)
    .catch(err => {
      console.log(err);
    });
}
export default search;
