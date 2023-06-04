import { UnsplashAPI } from './UnsplashAPI'
import createGalleryCard from '../templates/gallery-card.hbs'
import refs from './refs'
import Pagination from 'tui-pagination'
import 'tui-pagination/dist/tui-pagination.css'

/**
  |============================
  | Імпортуй свою API і напиши фу-цію "onRenderPage()", яка буде робити запит на сервер і вона ж відрендерить розмітку. Пробуй використовувати модульний підхід
  | можешь окремо строрити файл з розміткою і потім його імпортувати для використання. Також можешь використати шаблонізатор. Ментор тобі в цьому допоможе ; )
  | 
  | Після того коли ми успішно виконали рендер данних з бекенду, передай наступному учаснику виконання наступного функціоналу. Нам потрібно перейти на сайт бібліотеки
  | і підключити пагінацію - https://www.npmjs.com/package/tui-pagination - Бібліотека "tui-pagination".
  |
  | Після успішного підключення пагінації передай виконання на наступного учасника. Далі нам потрібно створити новий запит за картинками по ключовому слову. Переходь
  | в UnsplashAPI.
  |
  | Ось і готовий наш другий запит, давай його випробуємо! У нас з вами тут є тег "form", давайте його використаєм, знайдемо його у Дом дереві і повісимо слуха події
  | ви знаєте яка подія повинна бути) Ну і наостанок напишемо callBack для неї "onSearchFormSubmit()", там де зробимо головну логіку. Після рендера далі дорозберемось 
  | з нашою пагінація, цікаво як вона себе буде поводитись після зміни запиту?
  |
  | Якщо у нас залишився час, давате підключимо перемикач теми. Він знаходиться у файлі "isChangeTheme.js".
  |============================
*/
refs.form.addEventListener('submit', onSearchFormSubmit);

const options = { 
  totalItems: 5,
  itemsPerPage: 12,
  visiblePages: 5,
  page: 1,
  };

const unsplashApi = new UnsplashAPI()
const pagination = new Pagination(refs.container, options);

const page = pagination.getCurrentPage();
onRenderPage(page)


async function onRenderPage(page) {
 
  try {

    const response = await unsplashApi.getPopularPhotos(page)
    refs.galleryList.innerHTML = createGalleryCard(response.data.results)
    console.log(response.data.total);
    refs.container.classList.remove('is-hidden');

    
    pagination.reset(response.data.total);
  } catch(error) {
    console.log(error);
   }
  
}

async function createPopularPagination(event) {
  const currentPage = event.page;
  console.log(currentPage);

  try {

    const response = await unsplashApi.getPopularPhotos(currentPage)
    refs.galleryList.innerHTML = createGalleryCard(response.data.results)
    console.log(response.data.total);
    
  } catch(error) {
    console.log(error);
   }
}


pagination.on('afterMove', createPopularPagination);


async function onSearchFormSubmit(event){
  event.preventDefault();
  pagination.off('afterMove', createPopularPagination);

  const searchQuery = event.currentTarget.elements['user-search-query'].value.trim();
  console.log(searchQuery);
  
  unsplashApi.query = searchQuery;

  if (!searchQuery) {
    return alert('Error')
  }

  try {

    const response = await unsplashApi.getPhotosByQuery(page)
    refs.galleryList.innerHTML = '';

    

    refs.galleryList.innerHTML = createGalleryCard(response.data.results)
    pagination.reset(response.data.total)
    // console.log(response.data.total);
    pagination.on('afterMove', createByQueryPagination);

    if (response.data.total < 12) {
      refs.container.classList.add('is-hidden');
    } else {
      refs.container.classList.remove('is-hidden');
    }
    
    console.log(response.data.total);
    
  } catch(error) {
    console.log(error);
   }


}

async function createByQueryPagination(event) {
  const currentPage = event.page;
  console.log(currentPage);

  try {

    const response = await unsplashApi.getPhotosByQuery(currentPage)
    refs.galleryList.innerHTML = createGalleryCard(response.data.results)
    console.log(response.data.total);
    
  } catch(error) {
    console.log(error);
   }
}