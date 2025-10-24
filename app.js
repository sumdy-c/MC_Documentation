import Main from './pages/main.js';

export default class App extends MC {
  page;

  constructor() { super(); }

  render() {
    return $("<div>").append($.MC(Main));
  }
}
