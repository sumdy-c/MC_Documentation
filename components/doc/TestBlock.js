class Example extends MC {
    constructor(props) {
        super();
    }

    render(states, props) {
        return $('<div>').html(props);
    }
};

const state = MC.createState('Привет');
const context = MC.createContext();
const state2 = MC.createState('Вуаля');

const TestBlock = () => {

    return $('<div>').attr('id', 'test').addClass('doc_content_wrapper').append(
        $(Example, MC.Props({
            props: 'Hi i props!',
            states: [state, state2],
            context: context
        }), 'key'),

        $(Example, MC.Props({
            props: 'HELLO',
            states: [state, state2],
            context: context
        }), 'key2'),
    )
};