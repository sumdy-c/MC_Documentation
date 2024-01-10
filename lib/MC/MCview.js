const mc_context_global = new Set();
const anonim_render_global = new Set();
const mc_state_global = new Set();

(function() {
    var original$ = window.$;
    window.$ = function() {
        // компонент класса
        if(arguments[0].prototype instanceof MC) {
            if(MCEngine.active) {
                const result = MCEngine.renderChilds_Component(...arguments);
                if(result !== 'nt%Rnd#el') {
                    return result;
                }
            };

            return new MC_Component(new MC_Component_Registration(arguments));
        };

        // Если вызов производит функция или jquery
        const [ arg1, arg2, arg3 ] = arguments;
        if(arg3 && arg3.__proto__.constructor.name === "MCcontext") {
            if(MCEngine.active) {
                const result = MCEngine.renderChilds_FC(arg3, arg1);
                if(result !== 'nt%Rnd#el') {
                    return result;
                }
            };

            const id = MC.uuidv4();
            const [virtual, NativeVirtual] = arg3.createVirtual_FC(arg1, id);
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
            return MCEngine.renderChilds_FC(null, arg3);
        }

        const id = MC.uuidv4();
        const [virtual, NativeVirtual] = MC.createAnonim_FC(arg1, id);
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
            const result = MCEngine.renderChilds_FC(context, creator);
            if(result !== 'nt%Rnd#el') {
                return result;
            }
        };

        const id = MC.uuidv4();
        const [virtual, NativeVirtual] = context.createVirtual_FC(creator, id);
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
            return MCEngine.renderChilds_FC(null, context);
        }

        const creatorAnon = context;
        const dependencyAnon = creator;

        const id = MC.uuidv4();
        const [virtual, NativeVirtual] = MC.createAnonim_FC(creatorAnon, id);
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

    static createAnonim_FC(virtualFn, id) {
        
        const virtualElement = {
            Fn: virtualFn,
            parent_id: null,
            key: id,
        }

        MC.anonimCollection.add(virtualElement);

        return [{ context: null, id_element: id }, virtualElement];
    };

    static createAnonimComponent(component, id, key) {
        
        const virtualElement = {
            component: component,
            parent_id: null,
            key: id,
            identifier: key
        }

        MC.anonimCollection.add(virtualElement);

        return [{ context: null, id_element: id }, virtualElement];
    };

    state(value) {
        return MC.createLocallyState(value, this); 
    };

    static Props(props_object) {
        const props = [];

        const serviceObject = {
            props: null,
            context: null,
            states: []
        };

        for(let prop in props_object) {
            if(!Array.isArray(props_object[prop]) && props_object[prop] instanceof MCcontext) {
                props[2] = { context: props_object[prop] };
                serviceObject.context = props_object[prop];
                continue;
            };
    
            if(Array.isArray(props_object[prop]) && props_object[prop].every(el => el instanceof MCState)) {
                props[1] = { states: props_object[prop] };
                serviceObject.states = props_object[prop];
                continue;
            };
            

            props[0] = { props: props_object[prop] };
            serviceObject.props = props_object[prop];
        }

        // Если в компоненте нет элементов на его место будет отдан undefined; Отметить в документации
        return [props, serviceObject];
    };

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

    static createLocallyState(value, component) {
        const stateParam = {
            value: value,
            id: MC.uuidv4(),
        }

        const state = new MCState(stateParam, component); 

        new MCEngine().registrController(state);

        mc_state_global.add(state);
        
        return state;
    };

    static createContext(key) {
        const contextParam = {
            id: MC.uuidv4(),
            key: key
        };

        const context = new MCcontext(contextParam);

        mc_context_global.add(context);

        return context;
    };

    newKey(count) {
        if(!count){
            return MC.uuidv4();
        } else {
            const arrKey = [];
            for (let i = 0; i < count; i++) {
                arrKey.push(MC.uuidv4());
            }
            return arrKey;
        }
    
    };

    getState() {
        // отдать стейт
    
    };

    getContext() {

        // отдать контекст
    };
};


class MC_Component {
    constructor(html) {
        return this.getComponent(html);
    }

    getComponent(HTML) {
        return HTML;
    }

};

class MC_Component_Registration {
    constructor(newComponent) {
        let [ComponentClass, componentArgs, key] = newComponent;

        if(typeof componentArgs === 'string') {
            key = componentArgs;
            componentArgs = null;
        };

        let args = componentArgs;
        if(!componentArgs) {
            args = [ null, {
                    context: null,
                    props: null,
                    states: null,
                }
            ];
        }
        return this.register(ComponentClass, args, key);
         
    };

    register(component, componentArgs, key) {

        const [ props, service ] = componentArgs;

        if(service.context) {
            const mc_component = new component(service.props, service.context);

            const locally_states = [];

            mc_state_global.forEach(item => {
                if(item.local && item.local === mc_component) {
                    locally_states.push(item);
                }
            });

            const id = MC.uuidv4();
            const [virtual, NativeVirtual] = service.context.createVirtual_Component(mc_component, id, key);

            const global_state = [];

            service.states && service.states.map((state) => {
                if(state.__proto__.constructor.name === "MCState") {
                    state.virtualCollection.add(virtual);
                    global_state.push(state.value);
                } else {
                    console.error('[MC] Ошибка обработки объекта контролёра.');
                }
            });

            const local_state = [];

            locally_states && locally_states.map((state) => {
                if(state.__proto__.constructor.name === "MCState") {
                    state.virtualCollection.add(virtual);
                    local_state.push(state.value);
                } else {
                    console.error('[MC] Ошибка обработки объекта контролёра.');
                }
            });

            NativeVirtual.props = service.props;

            const node = mc_component.render({ global: global_state, local: local_state }, service.props);
            
            if(!node) {
                const micro_component = document.createElement('micro_component');
                micro_component.setAttribute("style", "height: 0; width: 0; display: none;");
                micro_component.setAttribute("mc", service.context.id);
                NativeVirtual.controller = { global: service.states, local: locally_states };
                NativeVirtual.HTMLElement = micro_component;
                return micro_component;
            };

            let global_st = service.states ? service.states : [];
            let local_st = locally_states ? locally_states : [];
    
            node[0].setAttribute("mc", service.context.id);
            NativeVirtual.controller = { global: global_st, local: local_st };
            NativeVirtual.HTMLElement = node[0];
            return node[0];
        } else {
            const mc_component = new component(service.props, service.context);

            const locally_states = [];

            mc_state_global.forEach(item => {
                if(item.local && item.local === mc_component) {
                    locally_states.push(item);
                }
            });
    
            const id = MC.uuidv4();
            const [ virtual, NativeVirtual ] = MC.createAnonimComponent(mc_component, id, key);

            const global_state = [];
            service.states && service.states.map((state) => {
                if(state.__proto__.constructor.name === "MCState") {
                    state.virtualCollection.add(virtual);
                    global_state.push(state.value);
                } else {
                    console.error('[MC] Ошибка обработки объекта контролёра.');
                }
            });

            const local_state = [];

            locally_states && locally_states.map((state) => {
                if(state.__proto__.constructor.name === "MCState") {
                    state.virtualCollection.add(virtual);
                    local_state.push(state.value);
                } else {
                    console.error('[MC] Ошибка обработки объекта контролёра.');
                }
            });

            NativeVirtual.props = service.props;

            const node = mc_component.render({ global: global_state, local: local_state }, service.props);
    
            if(!node) {
                const micro_component = document.createElement('micro_component');
                micro_component.setAttribute("style", "height: 0; width: 0; display: none;");
                micro_component.setAttribute("mc", 'anon');
                NativeVirtual.controller = { global: service.states, local: locally_states };
                NativeVirtual.HTMLElement = micro_component;
                return micro_component;
            }

            let global_st = service.states ? service.states : [];
            let local_st = locally_states ? locally_states : [];
    
            node[0].setAttribute("mc", 'anon');
            NativeVirtual.controller = { global: global_st, local: local_st };
            NativeVirtual.HTMLElement = node[0];
            return node[0];
        }
    }
};