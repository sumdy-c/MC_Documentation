const Aside = MC.createContext();
const AsideСontents = MC.createState({
    buttons: [
        { 
            text: 'Вступление',
            value: 'start',
            active: true
        },
        { 
            text: 'Установка',
            value: 'install',
            active: false
        },
        { 
            text: 'Контейнеризация',
            value: 'containers',
            active: false
        },
        { 
            text: 'Обновление контейнеров',
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
    ]
});

const Content = MC.createContext();
const ContentDoc = MC.createState('start');

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
            $.MC(Aside, (state) => {

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
            }, [AsideСontents]),

            $('<div>').addClass('doc_content_block').append(
                $.MC(Content, (state) => {  
                    const [ content_doc ] = state;
                    switch(content_doc) {
                        case 'start':
                            return StartBlock();
                        case 'install':
                            return InstallBlock();
                        case 'containers':
                            return ContainersBlock();
                        case 'containers_update':
                            return UpdateBlock();
                        case 'guard_styles':
                            return StylesBlock();
                        case 'improvement':
                            return ImprovementBlock();
                    }
                
                }, [ContentDoc])
            ),
        ),

    )
};