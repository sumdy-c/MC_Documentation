class ExampleTwo extends MC {
    constructor(props) {
        super();
    }

    render(states, props) {
        console.log('дочерний')
        const [ glob ] = states.global;

        return $('<div>').html(glob);
    }
};

class Example extends MC {
    state;
    glob;
    constructor(props) {
        super();
        this.state = super.state(1);
        this.glob = MC.createState(1);
    }

    update() {
        // this.state.set(this.state.get() + 1);
        this.glob.set(this.glob.get() + 1);
    };

    render(states, props) {
        console.log('родитель')
        const [ loc ] = states.local;
        return $('<div>').html(props).append(
            [1, 2, 23].map((item, iter) => {
                return $(ExampleTwo, MC.Props({
                    props: loc,
                    states: [this.glob]
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