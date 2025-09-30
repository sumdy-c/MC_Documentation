declare namespace MC {
	interface InitOptions {
		controlled?: boolean;
	}

	function init(options?: InitOptions): string;
	function createState(value: any, key: string): MCState;
	function uState(value: any, key: string, notUpdate?: boolean): MCState;
	function uContext(key: string): MCcontext;
	function createLocallyState(value: any, key: string, component: any): MCState;
	function createContext(key: string): MCcontext;
	function Props(
		propsObject: Record<string, any>
	): [any, { props: any; controlled: boolean; context: MCcontext | null; states: MCState[] }];
	function uuidv4(): string;

	const version: string;
	const keys: string[];
	const anonimCollection: Set<any>;
	const functionCollecton: Set<any>;
	const mc_state_global: Set<any>;
	const mc_context_global: Set<any>;
	const mc_solo_render_global: Set<any>;
	const mc_demand_render_global: Set<any>;

	interface MC_setting {
		controlled: boolean;
	}

	let MC_setting: MC_setting;
}

declare class MCcontext {
	id: string;
	key: string | null;
	virtualCollection: Set<any>;
	constructor(param: { id: string; key?: string | null });
	render(): void;
	createVirtual_FC(
		virtualFn: (...args: any[]) => any,
		id: string
	): [{ context: string | null; id_element: string }, any];
	createVirtual_Component(
		component: any,
		id: string,
		key: string
	): [{ context: string | null; id_element: string }, any];
}

declare class MCState {
	id: string;
	value: any;
	key: string;
	virtualCollection: Set<any>;
	passport?: any;
	local?: any;
	constructor(stateParam: { value: any; key: string; id: string }, local?: any);
	setPassport(passport: any): void;
	set(value: any): void;
	get(): any;
}

declare class MCEngine {
	state: any;
	static active: boolean;
	handlerRender(target: {id: string}, fn: (state: any) => void, path?: string): any;
	render(state: MCState): void;
	static renderChilds_FC(context: MCcontext | null, creator: (...args: any[]) => any): any;
	static renderChilds_Component(component: any, props: any, key?: string): any;
	registrController(state: MCState): void;
}

declare class MC_Component {
	constructor(html: any);
	static createEmptyElement(): HTMLElement;
	getComponent(html: any): any;
}

declare class MC_Component_Registration {
	constructor(newComponent: [new (...args: any[]) => any, any, string]);
	register(component: any, componentArgs: any, key: string): HTMLElement | string;
}

export { MC, MCEngine, MCState, MC_Component, MC_Component_Registration, MCcontext };
