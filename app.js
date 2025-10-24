import Main from "./pages/main.js";

export default class App extends MC {
  constructor() {
    super();
  }

  render() {
    return $("<div>").append($.MC(Main));
  }
}
