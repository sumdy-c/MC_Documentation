class PhilosophyContent extends MC {
  constructor() {
    super();
  }

  render() {
    return container(
      articleWrapper(
        sectionTitle("Философия"),
        heading1("Подробное объяснение значения плагина")
      )
    );
  }
}
