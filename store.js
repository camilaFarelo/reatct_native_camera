import { createStore, combineReducers } from 'redux';
import imagesReducer from './reducers/imagesReducer';

const rootReducer = combineReducers({
  images: imagesReducer
});

const configureStore = () => {
  return createStore(rootReducer);
}

export default configureStore;