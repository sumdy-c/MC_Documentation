const Aside = MC.createContext();
const AsideСontents = MC.createState({
    buttons: [
        { 
            text: 'Вступление',
            value: 'start',
            active: false
        },
        { 
            text: 'Установка',
            value: 'install',
            active: false
        },
        { 
            text: 'Контейнеры',
            value: 'fn-containers',
            active: false
        },
        { 
            text: 'Контейнеры: Часть 2',
            value: 'fn-containers-deep',
            active: true
        },
        { 
            text: 'Компоненты',
            value: 'containers',
            active: false
        },
        { 
            text: 'Работа с обновлением',
            value: 'containers_update',
            active: false   
        },
        { 
            text: 'Безопасная стилизация',
            value: 'guard_styles',
            active: false
        },
        { 
            text: 'Развитие',
            value: 'improvement',
            active: false
        },
        { 
            text: 'Тестовый раздел',
            value: 'test',
            active: false
        },
    ]
});

const Content = MC.createContext();
const ContentDoc = MC.createState('fn-containers-deep');

const DocumentationPage = (PAGES) => {
    return $('<div>').addClass('doc__main').append(   
        
        $('<div>').addClass('doc_top_bar').append(
            $('<div>').addClass('main__welcome_title_container').append(
                $('<span>').addClass('doc_logo_button').text(`← MC`).on('click', () => {
                    PAGES.set({ link: 'welcome', back: true });
                })
            ),
            $('<div>').addClass('main__welcome_top_bar_live_text').html('Документация')
        ),

        $('<div>').css({
            display: 'flex',
            height: 'calc(100% - 50px)'

        }).append(
            $((state) => {

                const [ aside_content ] = state;

                return $('<div>').addClass('doc__aside_panel').append(
                    aside_content.buttons.map((button, iter) => {
                        return $('<div>').addClass(button.active ? 'doc__aside_panel_button_active' : 'doc__aside_panel_button').text(button.text).on('click', () => {
                            if(!button.active) {
                                const obj = AsideСontents.get();
                                obj.buttons = aside_content.buttons.map(btn => {
                                    btn.active = false
                                    return btn;
                                });
                                obj.buttons[iter].active = true;
                                AsideСontents.set(obj);
                                ContentDoc.set(button.value);
                            }
                        });
                    }),
                )
            }, [AsideСontents], Aside),

            $('<div>').addClass('doc_content_block').append(
                $((state) => {
                    PrismReInit();
                    const [ content_doc ] = state;
                    switch(content_doc) {
                        case 'start':
                            return StartBlock();
                        case 'install':
                            return InstallBlock();
                        case 'fn-containers':
                            return ContainersBlock();
                        case 'fn-containers-deep':
                            return ContainersBlockDeep();
                        case 'containers':
                            return ComponentBlock();
                        case 'containers_update':
                            return UpdateBlock();
                        case 'guard_styles':
                            return StylesBlock();
                        case 'improvement':
                            return ImprovementBlock();
                        case 'test':
                            return TestBlock();
                    }
                }, [ContentDoc], Content)
            ),
        ),

    )
};