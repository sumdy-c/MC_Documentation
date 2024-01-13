
const state = MC.createState('Привет');
const context = MC.createContext();
const state2 = MC.createState('Вуаля');

const TestBlock = () => {

    return $('<div>').attr('id', 'test').addClass('doc_content_wrapper').append(
        'test'
    )
};