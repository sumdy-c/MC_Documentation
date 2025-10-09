class Test_Count extends MC {
    constructor() {
        super();
    }

    render(states, { childText }, vdom) {
        const [ counter ] = states.global;

        $.MC.effect(() => {
            console.log(`монтирование ${vdom.key}`);

            return () => {
                console.log(`размонтирование ${vdom.key}`);
            }
        }, []);

        if(!childText) {
            return $('<div>').text(`other component = ${counter}`);
        }

        return $('<div>').text(`classes counter = ${childText} + ${counter}`);
    }
}

class SomeComponent extends MC {
    constructor() {
        super();
        this.lState = super.state(true);
        
    }

    render(states) {
        const state = MC.uState('text', 'text_state-SomeComponent');
        const [ lState ] = states.local;

    

        return $('<div>').append(
            lState && $.MC(Test_Count, state),

            buttonOutline('setView_Local').on('click', () => this.lState.set(!this.lState.get())), // сколько сюда не кликай а cleanUp в консоле не будет
        );
    }
}

class TestPage extends MC {
    constructor() {
        super();
        this.view = super.state(true);
    }

    render(states) {
        const state = MC.uState(1, 'testPageState');
        const [ view ] = states.local;

        const componentFunction = function([state]) {
            return $('<div>').text(state);
        };

        return $('<div>').append(
          
            view && $.MC(SomeComponent), // зато будет тут

            $.MC(componentFunction, { TEST_PROP: "TEST" }, [state]),
            
            spacer(),
            
            $.MC(([state]) => {
                return $('<div>').text(state);
            }, [state], 'interator'),

            spacer(),

            // $.MC(Test_Count, state),

            // $.MC(Test_Count, { childText: 'childText' }, state),
            
            spacer(),

            $.MC(([ state ], { view }) => {
                const stateChild = MC.uState('child', 'testPageStateChilds');

                return $('<div>').text(`parent = ${state}`).append(
                
                    view && $.MC(([childText], { count }) => {
                        
                        return $('<div>').append(
                            $('<span>').text(childText + `count = ${count}`)
                        );
                    }, { count: state }, [stateChild]),

                    $.MC(([stateChilds], { prop }) => {
                        return $('<div>').text(stateChilds + ` parent val = ${prop}`);
                    }, { prop: state }, [stateChild])

                );
            }, { view: view }, [state]),

            spacer(),

            buttonOutline('state++').on('click', () => state.set(state.get() + 1)),
            buttonOutline('setView').on('click', () => this.view.set(!this.view.get())),
        );
    }
}