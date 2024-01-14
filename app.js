const PrismReInit = () => {
    setTimeout(() => {
        Prism.highlightAll();
        Prism.plugins
    }, 5);
}

document.addEventListener('DOMContentLoaded', () => {
    const rootEl = $('#root');
    const APP = MC.createContext();
    const PAGES = MC.createState({
        link: 'api',
        back: false,
    });

    rootEl.append(
        $((state) => {
            PrismReInit();
            const [ pages ] = state;
            switch(pages.link) {
                case 'welcome':
                    return WelcomePage(PAGES, PAGES.get().back);
                case 'documentation':
                    return DocumentationPage(PAGES);
                case 'api':
                    return APIPage(PAGES);
            };
        }, [PAGES], APP),
    );
});