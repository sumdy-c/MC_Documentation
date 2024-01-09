const context1 = MC.createContext();
const state = MC.createState({ val: '1' });
const child = MC.createState({ val: '2' });

class Test extends MC {
    static counter = 0;
    state;
    constructor() {
        super();
        this.state = MC.createState({ val: '2' });
        ++Test.counter;
    };

    render() {
        return $('<div>').html('Привет! Я настоящий компонент!').append(
            
            $(([ state ]) => {
                return $('<div>').html(state.val);
            }, [this.state]),
            
            $('<button>').html('render').on('click', () => {
                this.state.set({ val: Date.now()})
            })
        )
    };
};

const Children = ([]) => {
    return $('<div>').html('Без компонента');
};

const TestBlock = () => {
    return $('<div>').attr('id', 'test').addClass('doc_content_wrapper').append(

        $(Children, []),

        $(Test),

        $(Test),

        $('<button>').html('render').on('click', () => {
            state.set({ val: Date.now()})
        })
    )
}