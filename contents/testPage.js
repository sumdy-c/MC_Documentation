class Button extends MC {
  render(_, { text, event }) {
    return $('<button>').text(text).on('click', event);
  }
}

class TodoApp extends MC {
  constructor() {
    super();
    this.todos = super.state([]);
    this.inputValue = '';
  }

  addTodo() {
    if (this.inputValue.trim()) {
      const list = this.todos.get();
      list.push(this.inputValue.trim());
      this.inputValue = '';
      this.todos.set(list);
    }
  }
  
  deleteTodo(i) {
    const list = this.todos.get();
    list.splice(i, 1);
    this.todos.set(list);
  }

  render(state) {
    const [todos] = state.local;
    
    return $('<div>').append(
      
        $('<input>').val(this.inputValue).on('input', e => this.inputValue = e.target.value),
      
        $.MC(Button, { text: 'Add', event: () => this.addTodo()}),
      
        $('<div>').append(
            todos.map((task, i) =>
                $('<div>').append(
                    $('<span>').text(task + ' '),
                    $.MC(Button, { text: 'Delete', event: () => this.deleteTodo(i)}),
                )
            )
        )
    );
  }
}

class TestPage extends MC {
    constructor() {
        super();
        this.view = super.state(true);
    }

    render(states) {
        return $('<div>').append(
            $.MC(TodoApp)
        )
    }
}