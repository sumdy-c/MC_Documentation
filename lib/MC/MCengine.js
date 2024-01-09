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

    static renderChilds(context, creator) {
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
                        newNode[0].setAttribute("mc", 'anon');
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
                    newNode[0].setAttribute("mc", context.id);
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