const TestBlock = () => {

    const myState = MC.createState('Привет, я создан!'); 
    const myState2 = MC.createState('Привет, я создан!');

    return $('<div>').attr('id', 'test').addClass('doc_content_wrapper').append(
        
        $((state) => {
            console.log(state)
            return $("<div>").text(state).append(
                $('<button>').on('click', () => {
                })
            );
        }, [myState]),

    )
};