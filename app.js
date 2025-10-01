class AppDocs extends MC {
    /**
     * Текущая страница
     */
    page;

    constructor() {
        super();
        this.PAGES = {
            MAIN: 'main',
            DOCS: 'docs',
        }

        const page = localStorage.getItem('page');
        this.page = super.state(page ? page : this.PAGES.MAIN);
    }

    setPage(page) {
        this.page.set(page);
        localStorage.setItem('page', page);
    }

    render(states) {
        const [ page ] = states.local;

        return $('<div>').addClass('relative flex h-auto min-h-screen w-full flex-col').append(
            $('<div>').addClass('flex h-full grow flex-col').append(
                $.MC(Header, { 
                    currentPage: page,
                    goToDocs: () => this.setPage(this.PAGES.DOCS),
                    goToHome: () => this.setPage(this.PAGES.MAIN),
                }),
                $('<div>').append(
                    (page === this.PAGES.MAIN) && $.MC(MainPage, {
                        goToDocs: () => this.setPage(this.PAGES.DOCS),
                    }),
                    (page === this.PAGES.DOCS) && $.MC(DocsPage)
                ),
                $.MC(Footer),
            )
        );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const cssManager = new CustomCSS(['other.css']);
    window.cssManager = cssManager;
    
    $('#root').append($.MC(AppDocs))
});