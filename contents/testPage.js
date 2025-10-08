class Test_Count extends MC {
    constructor() {
        super();
    }

    render(states) {
        const [ counter ] = states.global;

        $.MC.effect(() => {
            console.log('effect Test_Counter');
        }, [])

        return $('<div>').text(`classes counter = ${counter}`);
    }
}

/**
 * Привязывается куда-то рандомно, посмотреть в cleanUp
 */
class TestPage extends MC {
    constructor() {
        super();
    }

    render() {
        const state = MC.uState(1, 'testPageState');

        $.MC.effect(() => {
            console.log('effect TESTPage')
        }, []);

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

            $.MC(function([state]) {
                const stateChild = MC.uState('child', 'testPageStateChilds');

                return $('<div>').text(`parent = ${state}`).append(
                    $.MC(([stateChilds], { prop }) => {
                        return $('<div>').text(stateChilds + ` parent val = ${prop}`);
                    }, { prop: state }, [stateChild])

                );
            }, [state]),

            spacer(),

            buttonOutline('state++').on('click', () => state.set(state.get() + 1))
        );
    }
}