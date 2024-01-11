document.addEventListener('DOMContentLoaded', () => {
    const rootEl = $('#root');
    const APP = MC.createContext();
    const PAGES = MC.createState({
        link: 'welcome',
        back: false,
    });

    rootEl.append(
        $((state) => {
            const [ pages ] = state;
            switch(pages.link) {
                case 'welcome':
                    return WelcomePage(PAGES, PAGES.get().back);
                case 'documentation':
                    return DocumentationPage(PAGES);
                case 'api':
                    return ExamplePage(PAGES);
            };
        }, [PAGES], APP)
    );
});