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