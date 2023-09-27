import { ADD_IMAGE } from '../actions/types';

const initialState = {
  images: []
};

const placeReducer = (state = initialState, action) => {
  switch(action.type) {
    case ADD_IMAGE:
      return {
        ...state,
        images: state.images.concat(action.payload),
      };
    default:
      return state;
  }
}

export default placeReducer;