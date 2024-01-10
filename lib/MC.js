const mc_context_global = new Set();
const anonim_render_global = new Set();
const mc_state_global = new Set();

$.MC = function(context, creator, dependency) {
    if(context.__proto__.constructor.name === "MCcontext") {
        // Вроде гениально поступил
        if(MCEngine.active) {
            const result = MCEngine.renderChilds_FC(context, creator);
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
            return MCEngine.renderChilds_FC(null, context);
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

// Состояние

class MCState {
    /**
     * id состояния
     */
    id;

    /**
     * Значение состояния
     */
    value;

    /**
     * Ключ доступа к состоянию
     */
    key;

    /**
     * Коллекция закреплённых элементов 
     */
    virtualCollection;
    
    /**
     * Разрешение на изменение
     */
    passport;

    /**
     * 
     * @param {} stateParam 
     */
    constructor(stateParam) {
        const { value, key, id } = stateParam;
        this.value = value;
        this.key = key;
        this.id = id;
        this.virtualCollection = new Set();
    }

    getPassport(passport) {
        this.passport = passport;
    }

    set(value) {
        if(this.passport) {
            this.value = value;
            this.passport.value = this.value;
        }
    }

    get() {
        return this.value;
    }

};

// ренедер

class MCEngine {
    state;
    static active = false;
    constructor() {

    }


    handlerRender(target, fn, path) {
		let tree = {};
		if (!path) {
			path = 'obj';
		}
		const proxy = new Proxy(target, {
			get: (_, prop) => {
				if (typeof target[prop] != 'object') {
					return target[prop];
				}
				if (tree[prop] === undefined) {
					tree[prop] = this.handlerRender(target[prop], fn, `${path}.${prop}`);
				}
				return Reflect.get(...arguments);
			},
			set: (_, prop, val) => {     
                fn(this.state);
                return target[prop];
            },
		});
		return proxy;
	}

    render(state) {
        MCEngine.active = true;
        state.virtualCollection.forEach(virtualData => {
            
            if(!virtualData.context) {
                MC.anonimCollection.forEach(virtualEl => {
                    if(virtualEl.key === virtualData.id_element) {
                        const values = [];                        

                        virtualEl.controller.forEach(controller => {
                            values.push(controller.value);
                        });

                        const newNode = virtualEl.Fn(values)[0];
                        virtualEl.HTMLElement.replaceWith(newNode);
                        virtualEl.HTMLElement = newNode;
                    }
                });

                MCEngine.active = false;
                return;
            };

            mc_context_global.forEach(context => {
                if(context.id === virtualData.context) {
                    context.virtualCollection.forEach(virtualEl => {
                        if(virtualEl.key === virtualData.id_element) {
                            const values = [];                        
                            virtualEl.controller.forEach(controller => {
                                values.push(controller.value);
                            });
                            
                            const newNode = virtualEl.Fn(values)[0];
                            virtualEl.HTMLElement.replaceWith(newNode);
                            virtualEl.HTMLElement = newNode;
                        }
                    })
                }
            })
        });

        MCEngine.active = false;
        return;
    };

    static renderChilds_FC(context, creator) {
        let node = null;
        let finder = false;

        if(!context) {
            MC.anonimCollection.forEach(virtual => {
                if(virtual.Fn.toString() === creator.toString()) {
                    finder = true;
                    const values = [];
                    virtual.controller.forEach(controller => {
                        values.push(controller.value);
                    });
    
                    let newNode = virtual.Fn(values);
                    if(!newNode) {
                        newNode = [];
                        newNode[0] = document.createElement('micro_component');
                        newNode[0].setAttribute("style", "height: 0; width: 0; display: none;");
                        newNode[0].setAttribute("mc", virtual.id_element);
                    }
                    virtual.HTMLElement = newNode[0];
                    node = virtual.HTMLElement;
                }
            });
            return;
        }

        context.virtualCollection.forEach(virtual => {
            if(virtual.Fn.toString() === creator.toString()) {
                finder = true;
                const values = [];
                virtual.controller.forEach(controller => {
                    values.push(controller.value);
                });

                let newNode = virtual.Fn(values);
                if(!newNode) {
                    newNode = [];
                    newNode[0] = document.createElement('micro_component');
                    newNode[0].setAttribute("style", "height: 0; width: 0; display: none;");
                    newNode[0].setAttribute("mc", virtual.id_element);
                }
                virtual.HTMLElement = newNode[0];
                node = virtual.HTMLElement;
            }
        });
        if(!finder) {
            return 'nt%Rnd#el';
        }
        return node;
    }

    registrController(state) {
        this.state = state;
        const objectVirtualController = {
            value: state.id
        }
        
        const passport = this.handlerRender(objectVirtualController, this.render, '');

        state.getPassport(passport);
    };
};

class MCcontext {
    /**
     * Идентификтор контекста
     */
    id;

    /**
     * Ключ контекста
     */
    key;

    /**
     * Коллекция виртуальных элементов
     */
    virtualCollection;

    constructor(param) {
        const { id, key } = param;
        this.id = id;
        this.key = key ?? null;
        this.virtualCollection = new Set();
    }

    render() {
        this.virtualCollection
    }

    createVirtual(virtualFn, id) {
            const virtualElement = {
                Fn: virtualFn,
                parent_id: this.id,
                key: id,
            }
            this.virtualCollection.add(virtualElement);

            return [{ context: this.id, id_element: id }, virtualElement];
    }
};