const mc_context_global = new Set();
const anonim_render_global = new Set();
const mc_state_global = new Set();

(function() {
    // Save the original $ function
    var original$ = window.$;

    // Define a new $ function
    window.$ = function() {

        if(arguments[0].prototype instanceof MC) {
            // сделать привязку состояния ко всем передаваемым жлементам + props
            return new arguments[0]().render();
        }

        const [ arg1, arg2, arg3 ] = arguments;

        if(arg3 && arg3.__proto__.constructor.name === "MCcontext") {
            if(MCEngine.active) {
                const result = MCEngine.renderChilds(arg3, arg1);
                if(result !== 'nt%Rnd#el') {
                    return result;
                }
            };

            const id = MC.uuidv4();
            const [virtual, NativeVirtual] = arg3.createVirtual(arg1, id);
            const arg = [];
            dependency && dependency.map((state) => {
                if(state.__proto__.constructor.name === "MCState") {
                    state.virtualCollection.add(virtual);
                    arg.push(state.value);
                } else {
                    console.warn('Не стейт');
                }
            });

            const node = arg1(arg);
            
            if(!node) {
                const micro_component = document.createElement('micro_component');
                micro_component.setAttribute("style", "height: 0; width: 0; display: none;");
                micro_component.setAttribute("mc", arg3.id);
                NativeVirtual.controller = dependency;
                NativeVirtual.HTMLElement = micro_component;
                return micro_component;
            }

            node[0].setAttribute("mc", arg3.id);
            NativeVirtual.controller = dependency;
            NativeVirtual.HTMLElement = node[0];
            return $(node[0]);
    }


    if(typeof arg1 === 'function' && !arg3) {
        if(MCEngine.active) {
            return MCEngine.renderChilds(null, arg3);
        }

        const id = MC.uuidv4();
        const [virtual, NativeVirtual] = MC.createAnonimVirtual(arg1, id);
        const arg = [];

        arg2 && arg2.map((state) => {
            if(state.__proto__.constructor.name === "MCState") {
                state.virtualCollection.add(virtual);
                arg.push(state.value);
            } else {
                console.warn('Не стейт')
            }
        });

        const node = arg1(arg);

        if(!node) {
            const micro_component = document.createElement('micro_component');
            micro_component.setAttribute("style", "height: 0; width: 0; display: none;");
            micro_component.setAttribute("mc", 'anon');
            NativeVirtual.controller = arg2;
            NativeVirtual.HTMLElement = micro_component;
            return micro_component;
        }

        node[0].setAttribute("mc", 'anon');
        NativeVirtual.controller = arg2;
        NativeVirtual.HTMLElement = node[0];
        return $(node[0]);
    }

        let resultCall = original$.apply(this, arguments);

        return resultCall;
    };
})();

$.MC = function(context, creator, dependency) {
    if(context.__proto__.constructor.name === "MCcontext") {
        if(MCEngine.active) {
            const result = MCEngine.renderChilds(context, creator);
            if(result !== 'nt%Rnd#el') {
                return result;
            }
        };

        const id = MC.uuidv4();
        const [virtual, NativeVirtual] = context.createVirtual(creator, id);
        const arg = [];
        dependency && dependency.map((state) => {
            if(state.__proto__.constructor.name === "MCState") {
                state.virtualCollection.add(virtual);
                arg.push(state.value);
            } else {
                console.warn('Не стейт');
            }
        });

        const node = creator(arg);
        
        if(!node) {
            const micro_component = document.createElement('micro_component');
            micro_component.setAttribute("style", "height: 0; width: 0; display: none;");
            micro_component.setAttribute("mc", context.id);
            NativeVirtual.controller = dependency;
            NativeVirtual.HTMLElement = micro_component;
            return micro_component;
        }

        node[0].setAttribute("mc", context.id);
        NativeVirtual.controller = dependency;
        NativeVirtual.HTMLElement = node[0];
        return node[0];
    }


    if(typeof context === 'function' && !dependency) {
        
        if(MCEngine.active) {
            return MCEngine.renderChilds(null, context);
        }

        const creatorAnon = context;
        const dependencyAnon = creator;

        const id = MC.uuidv4();
        const [virtual, NativeVirtual] = MC.createAnonimVirtual(creatorAnon, id);
        const arg = [];

        dependencyAnon && dependencyAnon.map((state) => {
            if(state.__proto__.constructor.name === "MCState") {
                state.virtualCollection.add(virtual);
                arg.push(state.value);
            } else {
                console.warn('Не стейт')
            }
        });

        const node = creatorAnon(arg);

        if(!node) {
            const micro_component = document.createElement('micro_component');
            micro_component.setAttribute("style", "height: 0; width: 0; display: none;");
            micro_component.setAttribute("mc", 'anon');
            NativeVirtual.controller = dependencyAnon;
            NativeVirtual.HTMLElement = micro_component;
            return micro_component;
        }

        node[0].setAttribute("mc", 'anon');
        NativeVirtual.controller = dependencyAnon;
        NativeVirtual.HTMLElement = node[0];
        return node[0];
    }
};

class MC {
    constructor() {
        if (MC._instance) {
            return MC._instance;
        }
    }

    static anonimCollection = new Set(); 

    static createAnonimVirtual(virtualFn, id) {
        
        const virtualElement = {
            Fn: virtualFn,
            parent_id: null,
            key: id,
        }

        MC.anonimCollection.add(virtualElement);

        return [{ context: null, id_element: id }, virtualElement];
    }

    static uuidv4() {
		return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
			(c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
		);
	};

    static createState(value, key) {
        const stateParam = {
            value: value,
            key: key,
            id: MC.uuidv4(),
        }

        const state = new MCState(stateParam); 

        new MCEngine().registrController(state);

        mc_state_global.add(state);
        
        return state;
    };

    static createContext(key) {
        const contextParam = {
            id: MC.uuidv4(),
            key: key
        }
        
        const context = new MCcontext(contextParam);

        mc_context_global.add(context);

        return context;
    };

    render() {

    }

    getState() {
        // отдать стейт
    };

    getContext() {
        // отдать контекст
    };
};