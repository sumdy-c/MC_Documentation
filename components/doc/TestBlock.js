class ExampleTwo extends MC {
    constructor(props) {
        super();
    }

    render(states, props) {
        console.log(props);
        return $('<div>').html(props);
    }
};

class Example extends MC {
    state;
    constructor(props) {
        super();
        this.state = super.state(1);
        // console.log(this.state)
    }

    update() {
        this.state.set(this.state.get() + 1);
    }

    render(states, props) {
        // console.log('render');
        const [ loc ] = states.local;
        return $('<div>').html(props).append(
            [1, 2, 3, 4, 5].map((item, iter) => {
                return $(ExampleTwo, MC.Props({
                    props: loc
                }), `ex${iter}`);
            }),
            $('<button>').text('test').on('click', () => this.update())
        );
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
    )
};