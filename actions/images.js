// place.js
import { ADD_IMAGE } from './types';

export const addImg = img => {
  return {
    type: ADD_IMAGE,
    payload: img,
  }
}

clearTimeout(intervalId);