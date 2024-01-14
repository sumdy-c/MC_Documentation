class APICard extends MC {
    constructor() {
        super();
        this.viewCode = super.state(false);
    };

    setViewCode() {
        this.viewCode.set(!this.viewCode.get());
        if(this.viewCode.get()){
            PrismReInit();
        }
    };

    render(state, props) {
        const [ view ] = state.local;

        return $('<card>').addClass('api_card').append(
            $('<div>').addClass('api_card_header').append(
                subTitle(`${props.title} -`),
                text(props.description),
            ).on('click', () => this.setViewCode()),
            view && $('<div>').append(
                codeBlock(props.realization)
            )
        );
    }
};

const api_information = [
    {
        title: '$(fn: function | MCClass, props: MCState | MC.Props,  context: MCContext | null): HTML',
        realization: 
`$((state) => null);
$(ExampleClass, 'example_key');`,
        description: 'служит в качестве настраиваемой функции jQuery, адаптированной для работы с абстракциями Micro Component. Принимает такие параметры, как функция или класс Micro Component, состояние или свойства Micro Component, а также заданный контекст. Предназначена для беспрепятственной интеграции и манипулирования компонентами в определенной среде.',
    },
    {
        title: 'MC.createState(value: any, key: string): MCState',
        realization: 
`const state = MC.createState(null, 'example_key');
`,
        description: 'является частью класса Micro Component и используется для создания контроллера. В качестве параметров он принимает любое значение и ключ для идентификации. Метод возвращает объект, представляющий контроллер (MCState). Этот объект контроллера инкапсулирует состояние и функциональность, связанные с Micro Component, обеспечивая структурированный и эффективный подход к управлению состоянием внутри компонента.',
    },
    {
        title: 'MC.createContext(): MCContext',
        realization: 
`const context = MC.createContext();
`,
        description: 'инициализирует новый контекст и возвращает соответствующий объект контекста (MCContext).',
    },
    {
        title: 'super.state(value: any, key: string): MCState',
        realization: 
`class Example extends MC {
    constructor() {
        super();
        this.state = super.state(null, 'local_state');
    };
};`,
        description: 'используемый для создания локального контроллера в Micro Component, принимает любое значение и ключ для идентификации. Он возвращает объект (MCState), представляющий контроллер, инкапсулируя как состояние, так и функциональность. Обеспечивает структурированный и эффективный подход к управлению состоянием конкретного компонента.',
    },
    {
        title: 'render(states: { global: state: MCState[], local: state: MCState[] }, props: any): HTML',
        realization: 
`class Example extends MC {
    constructor() {
        super();
    };
    render() {
        return null;
    };
};`,
        description: 'вызванный для компонента класса, принимает объект states, содержащий глобальные и локальные состояния Micro Component, а также дополнительные реквизиты. Он возвращает HTML-представление, соответствующее указанному состоянию и свойствам компонента.',
    },
    {
        title: 'MC.getState(key: string): MCState[]',
        realization: `const state = MC.getState('example_key');`,
        description: 'извлекает массив состояний, идентифицированных указанным ключом.',
    },
    {
        title: 'MC.getContext(key: string): MCContext',
        realization: `const context = MC.getContext('example_key');`,
        description: 'извлекает контекст, идентифицированный указанным ключом.',
    },
];

const APIPage = (PAGES) => {
    return $('<div>').addClass('api__main').append(
        $('<div>').addClass('doc_top_bar').append(
            $('<div>').addClass('main__welcome_title_container').append(
                $('<span>').addClass('doc_logo_button').text(`← MC`).on('click', () => {
                    PAGES.set({ link: 'welcome', back: true });
                })
            ),
            $('<div>').addClass('main__welcome_top_bar_live_text').html('API'),
        ),

        $('<div>').addClass('api__container').append(
            api_information.map((card, i) => {
                return $(APICard, MC.Props({
                    props: card
                }),`api_card${i}`);
            })
        )
    )
};