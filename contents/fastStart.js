class FastStartContent extends MC {
  constructor() {
    super();
  }

  render() {
    return container(
      articleWrapper(
        sectionTitle("Быстрый старт"),
        heading1("Первые шаги в MC")
      )
    );
  }
}
