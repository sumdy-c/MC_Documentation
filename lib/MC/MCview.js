const mc_context_global = new Set();
const anonim_render_global = new Set();
const mc_state_global = new Set();

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
            micro_component.setAttribute("mc", virtual.id_element);
            NativeVirtual.controller = dependency;
            NativeVirtual.HTMLElement = micro_component;
            return micro_component;
        }

        node[0].setAttribute("mc", virtual.id_element);
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
            micro_component.setAttribute("mc", virtual.id_element);
            NativeVirtual.controller = dependencyAnon;
            NativeVirtual.HTMLElement = micro_component;
            return micro_component;
        }

        node[0].setAttribute("mc", virtual.id_element);
        NativeVirtual.controller = dependencyAnon;
        NativeVirtual.HTMLElement = node[0];
        return node[0];
    }
    
    return $('<div>');
};

class MC {

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

    getState() {
        // отдать стейт
    };

    getContext() {
        // отдать контекст
    };
};