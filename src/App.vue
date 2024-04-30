<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import axios from 'axios';
import { createDoc } from './script';
import HelloWorld from './components/HelloWorld.vue';

const logic = async () => {
  const doc = await createDoc();
  const sections = doc.querySelectorAll('[data-qa-id="vocabulary-wordset"]');
  const r = [...sections].map((section) => {
    const el1 = section.querySelectorAll('vim-core-peity-chart');
    const el2 = section.querySelectorAll('div.title-container div.title');
    const el3 = section.querySelectorAll('div.title-container div.subtitle');
    const elWords = section.querySelectorAll('div.words-container div.words');
    if (!(el1?.length === 1 && el2?.length === 1 && el3?.length === 1 && elWords?.length === 1)) {
      throw new Error('There is a problem with source data');
    }
    const words = elWords[0];
    const wordsList = words.querySelectorAll('div.word');
    const wordsArray = [...wordsList].map((w) => {
      // const word = w.querySelector('div.word-text');
      const progressObjects = w.querySelectorAll('.icon-progress');
      const translationObjects = w.querySelectorAll('.translation');
      const wordObjects = w.querySelectorAll('vim-word');
      if (!(
        progressObjects.length === 1
        && translationObjects.length === 1
        && wordObjects.length === 1
      )) {
        throw new Error('There is a problem with source data: word');
      }
      const attributesObject = progressObjects[0].attributes;
      const word = wordObjects[0].textContent?.trim();
      const id = wordObjects[0].getAttribute('sentence-id');
      const id2 = wordObjects[0].getAttribute('local-id');
      const id3 = wordObjects[0].getAttribute('meaning-id');
      if (id !== id2 || id !== id3) {
        throw new Error('There is a problem with source data: id');
      }
      const translation = translationObjects[0].textContent?.trim();
      const attributes: Array<string> = [];
      for (let i = 0; i < attributesObject.length; i += 1) {
        attributes.push(attributesObject[i].name);
      }
      if (!['_nghost-weg-c86', '_nghost-weg-c168'].some((x) => attributes.includes(x))) {
        console.log('missing', word, attributes);
        throw new Error('There is a problem with source data: attributes');
      }
      let progress = 0;
      if (attributes.includes('_nghost-weg-c168')) {
        progress = 10;
      }
      return {
        id, word, translation, progress,
      };
    });
    return {
      title: el2[0].textContent?.trim(),
      description: el3[0].textContent?.trim(),
      percentage: parseInt(el1[0].textContent?.trim() || '0', 10),
      wordsArray,
    };
  });
  console.log(r);
  await axios.post('http://localhost:3001/', r);
};

@Options({
  components: {
    HelloWorld,
  },
  mounted() {
    logic();
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
