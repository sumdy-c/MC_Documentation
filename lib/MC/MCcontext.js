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