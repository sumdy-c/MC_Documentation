class Child extends MC {
    constructor(){
        super()
    }

    render(state) {
        const [ text ] = state.global;
        return $('<div>').text(text)
    }
}

class Test extends MC {
    state;
    text;
    key;
    constructor() {
        super()
        this.state = super.state(false);
        this.text = super.state('Я тут'); // MC.createState('sdfs');
        this.key = super.newKey();
    }

    render() {
        return $('<div>').append(
            $(Child, MC.Props({
                state: [this.text]
            }), 'Child'),

            $('<button>').text('Hi!').on('click', () => {
                const states = MC.getState('class_id');
                states.forEach(state => {
                    state.set(state.get() + 1);
                })
            }),
        )
    }
}

const TestBlock = () => {
    return $('<div>').attr('id', 'test').addClass('doc_content_wrapper').append(
        $(Test, 'Test'),
        $(Test, 'Test1'),
    )
};