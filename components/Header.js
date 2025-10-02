class Header extends MC {
  constructor() {
    super();
    this.logo = `
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
            </svg>
          `;
  }

  getPageTitle(page) {
    switch(page) {
        case 'main': return 'Главная страница';
        case 'docs': return 'Документация'; 
    }
  }

  render(_s, { currentPage, goToHome, goToDocs }) {

    return $("<header>")
      .css({
        position: "sticky",
        top: "0px",
        backdropFilter: "blur(5px)",
        backgroundColor: 'rgb(26 26 26 / 75%)',
        transition: "100ms",
        zIndex: 10
      })
      .addClass(
        "flex items-center justify-between border-b border-gray-700 px-4 py-4 sm:px-6 lg:px-8"
      )
      .append(
        $("<div>")
          .addClass("flex items-center gap-3")
          .append(
            $("<div>").addClass("size-6 text-accent-dark").append(`
          ${this.logo}
        `)
          )
          .append(
            $("<h2>")
              .addClass("text-xl font-bold tracking-tight")
              .text("Micro Component"),
            $('<h5>').addClass('text-ml font-bold tracking-tight').text('| ' + this.getPageTitle(currentPage))
          )
      )
      .append(
        $("<div>")
          .addClass("flex items-center gap-4 md:gap-8")
          .append(
            $("<nav>")
              .addClass("flex items-center gap-4 md:gap-6")
              .append(
                $("<button>")
                  .addClass(
                    "text-sm font-medium hover:font-bold text-text-dark/70 hover:text-accent-dark"
                  )
                  .text("Примеры"),
                $("<button>")
                  .addClass(
                    "text-sm font-medium hover:font-bold text-text-dark/70 hover:text-accent-dark"
                  )
                  .text("API")
              )
          ).append(
            $("<button>")
              .addClass(
                "flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-accent-dark px-5 text-sm font-bold text-primary shadow-lg shadow-accent-dark/30 transition-all hover:bg-blue-400"
            ).append(
                $("<span>").addClass("truncate").text(currentPage === 'main' ? "Начать" : 'На главную')
            ).on('click', () => {
                if(currentPage === 'main') {
                    goToDocs();
                } else {
                    goToHome();
                }
            })
          )
      );
  }
}
