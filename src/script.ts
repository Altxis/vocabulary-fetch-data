import axios from 'axios';

export const createDoc = async () => {
  const { data: html } = await axios.get('/source.html');
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(html, 'text/html');
  return htmlDoc;
};
