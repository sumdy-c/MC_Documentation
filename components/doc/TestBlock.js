const context1 = MC.createContext();
const context2 = MC.createContext();

const state = MC.createState('GLOBAL_OTHER');
const child = MC.createState({ val: 'GLOBAL' });

// Ввести разделение состояний - Done!
// Определить область анонимного вызова - 
// Сделать возможный дочерний рендер у детей классовых компонентов так же функциональных

class Chill extends MC {
    state;
    constructor(){
        super();
        this.state = super.state('Я ДОЧЕРНИЙ');
    }

    render(state) {
        // console.log(state);
        if(state.global.length === 0) {
            return $('<div>').html("Я без свойств")
        }

        const [ text ] = state.local;
        const [ test ] = state.global;

        return (
            $('<div>').text(`Я ДОЧЕРНИЙ ${test}`)
        )
    }
}

class Test extends MC {
    value;
    rawin;
    key;
    constructor(props, context) {
        super();
        //обязательное создание для дочерних элементов уникальных ключей
        this.keys = super.newKey(2);
        this.value = super.state({ val: props.firstName });
        this.rawin = super.state({ val: 'LOCAL2' });
        this.locals = super.state('test');
    };

    setLocalName(){
        this.value.set({ val: Date.now()});
    }

    setLocalSecond(){
        this.rawin.set({ val: Date.now()});
    }

    render(state, props) {
        const [ global_state ] = state.global;
        const [ name, second, locals ] = state.local;

        return (
           $('<div>').html(`Hi, i ${props.text} component!`).append(
                $('<div>').attr('id', 'qweqwewqe').text(`Имя Робота ${name.val}`),
                $('<div>').text(`Фамилия Робота ${second.val}`),
                $('<div>').text(`Модель Робота ${global_state.val}`),

                $(Chill, MC.Props({
                    props: locals,
                    states: [this.locals],
                    context: context2
                }), this.keys[0]),

                $(Chill, this.keys[1]),

                $('<button>').text('Изменить Имя Робота').on('click', () => {
                    this.setLocalSecond();
                }),

                $('<button>').text('Изменить Фамилию Робота').on('click', () => {
                    this.locals.set(Date.now())
                })
           )
        );
    };
};

const TestBlock = () => {
    return $('<div>').attr('id', 'test').addClass('doc_content_wrapper').append(

        $(Test, MC.Props({
            props: { 
                text: 'classes',
                firstName: 'Carl'
            },
            states: [child],
            context: context1
        })),

        // $(Test, MC.Props({
        //     props: {
        //         text: 'Классный',
        //         firstName: 'Clement'
        //     },
        //     states: [child],
        // })),

        $('<button>').text('Изменить Модель Робота').on('click', () => {
            child.set({ val: 'Модель' + ' ' + Date.now()})
        }),
    )
};