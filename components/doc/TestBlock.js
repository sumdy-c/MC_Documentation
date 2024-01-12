class Example extends MC {
    constructor(props) {
        super();
    }

    render(states, props) {
        console.log(states);
        return $('<div>').html('Я компонент!');
    }
};

const state = MC.createState('Привет');
const state2 = MC.createState('Вуаля');

const TestBlock = () => {


    return $('<div>').attr('id', 'test').addClass('doc_content_wrapper').append(
        $(Example, MC.Props({
            props: 'Hi i props!',
            states: [state, state2],
        }), 'key'),
    )
};