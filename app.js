import Architecture from "./pages/architecture/Architecture.js";
import Doc from "./pages/doc/doc.js";
import Main from "./pages/main/main.js";

export default class App extends MC {
  constructor() {
    super();
    this.pageState = super.state('main'); // main | doc | architecture
  }

  render({ pageState }) {
    const [ page, setPage ] = pageState;
    
    return $("<div>").append(
      page === 'main' && $.MC(Main, { setPage }),
      page === 'doc' && $.MC(Doc),
      page === 'architecture' && $.MC(Architecture),
    );
  }
}
