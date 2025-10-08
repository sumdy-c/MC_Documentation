class Test_Count extends MC {
    constructor() {
        super();
    }

    render(states, { childText, count }, vdom) {
        const [ counter ] = states.global;

        $.MC.effect(() => {
            console.log(`монтирование ${vdom.key}`);

            return () => {
                console.log(`размонтирование ${vdom.key}`);
            }
        }, []);

        if(counter) {
            return $('<div>').text(`other component = ${counter}`);
        }
        // $.MC.effect(() => {
        //     console.log('effect Test_Counter');
        // }, [])

        return $('<div>').text(`classes counter = ${childText} + ${count}`);
    }
}

/**
 * Привязывается куда-то рандомно, посмотреть в cleanUp
 */
class TestPage extends MC {
    constructor() {
        super();
        this.view = super.state(true);
    }

    render(states) {
        const state = MC.uState(1, 'testPageState');
        const [ view ] = states.local;

        const componentFunction = function([state]) {
            return $('<vert>').text(state);
        };

        return $('<div>').append(
            
            $.MC(componentFunction, { TEST_PROP: "TEST" }, [state]),
            
            spacer(),
            
            $.MC(([state]) => {
                return $('<vert>').text(state);
            }, [state], 'interator'),

            spacer(),

            $.MC(Test_Count, state),
            
            spacer(),

            $.MC(function([ state ], { view }) {
                const stateChild = MC.uState('child', 'testPageStateChilds');

                return $('<div>').text(`parent = ${state}`).append(
                
                    view && $.MC(([childText], { count }) => {
                        
                        return $('<div>').append(
                            $.MC(Test_Count, { childText, count })
                        );
                    }, { count: state }, [stateChild]),

                    $.MC(([stateChilds], { prop }) => {

                        // эффекты не оказывают влияния для функциональных контейнеров

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