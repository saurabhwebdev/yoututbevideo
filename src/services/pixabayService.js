import { PIXABAY_API_KEY, PIXABAY_API_URL } from '../config/config';

export const searchPixabayImages = async (query = 'music', page = 1) => {
  try {
    const response = await fetch(
      `${PIXABAY_API_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(
        query
      )}&page=${page}&per_page=12&image_type=photo`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Pixabay images:', error);
    throw error;
  }
}; 