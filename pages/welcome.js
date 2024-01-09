const WELCOME = MC.createContext();
const WELCOME_CONTENT = MC.createContext();

const ANIM_TITLE = MC.createState({
    color: 'black',
    class_container: 'main__welcome_title_container_pos1',
    class_text: 'main__welcome_title_animate',
    firstText: 'Micro',
    secondText: 'Component',
    leftpos: 35,
});

const LiveText = MC.createState({
    ready: false,
    text: 'Привет! Надеюсь вы хорошо проведёте тут время!'
});

const WELC_CONTENT = MC.createState({
    introduction: true,
    button_array: [
        {
            text: 'Документация',
            srcImg: './asset/book.png',
            control: 'documentation'
        },
        {
            text: 'API',
            srcImg: './asset/api.png',
            control: false
        },
        {
            text: 'GitHub',
            srcImg: './asset/github.png',
            control: false
        },
        {
            text: 'Развитие',
            srcImg: './asset/improvement.png',
            control: false
        }
    ]
});

const PREVIEW =  MC.createState('sdfds');


const WelcomePage = (PAGES, back) => {

    const welc_obj = WELC_CONTENT.get();

    welc_obj.button_array.forEach(btn => {
        if(!btn.control) {
            btn.link = () => alert('В разработке');
        } else {
            btn.link = () => PAGES.set({ link: btn.control, back: true });
        }
    });

    function getRandomWordGenerator() {
        const wordsArray = [
          'Какая любимая игровая консоль разработчика? Браузерная!',
          'Почему фронтенд-разработчики предпочитают природу? Они любят деревья!',
          'Почему HTML-файл отправился к семейному психологу ? У него было слишком много проблем с отношениями "родитель-ребенок"',
          'Сколько программистов нужно, чтобы поменять лампочку? Ни одного, это проблема оборудования!',
          'Если вы посмотрите на код, который вы писали более полугода назад, то, скорей всего, вам покажется, что автор – кто-то другой',
          'Существует два вида языков программирования: одни – все ругают, другими не пользуются',
          'Пока компьютеры не умеют мыслить самостоятельно, им можно доверять',
          'На самом деле большинство багов – это фичи, просто не задокументированные',
          'Перед тем, как удалять файлы, убедитесь, что они не ваши',
          'В теории между теорией и практикой нет никакой разницы. На практике происходит иначе',
          'Существует всего 2 способа писать код без багов. Но работает почему-то третий',
          'Если никто не знает ответ на вопрос, пора начать читать документацию',
          'Не страшно если что-то не работает, страшно если заработало с первого раза'
        ];
      
        let currentIndex = 0;
      
        return function getNextRandomWord() {
          const word = wordsArray[currentIndex];
          currentIndex = (currentIndex + 1) % wordsArray.length; // Cycle through the array
          return word;
        };
    }

    const getRandomWord = getRandomWordGenerator();
    // анимации по таймауту, спорное решение нужное тут для показательной нагрузки на рендер
    if(!back) {
        setTimeout(() => {
            const obj = ANIM_TITLE.get();
            obj.class_text = 'main__welcome_title';
            ANIM_TITLE.set(obj);
                const animateInterval = setInterval(() => {
                    const obj = ANIM_TITLE.get();
                    if(obj.firstText.length === 1) {
                        clearInterval(animateInterval);
                        obj.firstText = 'MC';
                        obj.secondText = '';
                        ANIM_TITLE.set(obj);

                        setTimeout(() => {
                            const obj = ANIM_TITLE.get();
                            obj.class_container = 'main__welcome_title_container_pos2';
                            obj.class_text = 'main__welcome_title_movement';
                            ANIM_TITLE.set(obj);
                            setTimeout(() => {
                                const obj = ANIM_TITLE.get();
                                    obj.class_container = 'main__welcome_title_container';
                                    obj.class_text = 'main__welcome_title_logo';
                                    obj.coolElements = [];
                                ANIM_TITLE.set(obj);
                                const welc_obj = WELC_CONTENT.get();
                                    welc_obj.introduction = false;
                                    WELC_CONTENT.set(welc_obj);
                                const live_text_obj = LiveText.get();
                                    live_text_obj.ready = true;
                                    LiveText.set(live_text_obj);
                                    const interval_liveText = setInterval(() => {
                                        const live_text_obj = LiveText.get();
                                        live_text_obj.text = getRandomWord();
                                        LiveText.set(live_text_obj);
                                    }, 4500);
                            }, 530);
                        }, 200);
                        return;
                    };

                    obj.leftpos = obj.leftpos + 1.6;
                    obj.firstText = obj.firstText.slice(0, -1);
                    obj.secondText = obj.secondText.slice(0, -2);
                    ANIM_TITLE.set(obj);
                }, 100);
        }, 1500);
    }

    return $('<div>').addClass('main__welcome').append(

        $.MC(WELCOME, (state) => {
            const [ welc_content ] = state;
            return $('<div>').append(
                $('<div>').addClass(!welc_content.introduction ? 'main__welcome_top_bar' : null).append(
                    
                    $.MC(WELCOME, (state) => {
                        const [ anim_title ] = state;
                        return $('<div>').css({ width: 'max-content' }).append(
                            $('<div>').addClass(anim_title.class_container).css({ left: `${anim_title.leftpos}%` }).append(
                                $('<span>').css({ color: anim_title.color }).addClass(anim_title.class_text).text(`${anim_title.firstText} ${anim_title.secondText}`)
                            )
                        )
                    }, [ANIM_TITLE]),

                    $.MC(WELCOME, (state) => {
                        const [ live_text ] = state;
                        if(!live_text.ready) {
                            return null;
                        }

                        return $('<div>').addClass('main__welcome_top_bar_live_text').html(live_text.text)

                    }, [LiveText])

                )

            )
        }, [WELC_CONTENT]),

        $.MC(WELCOME_CONTENT, (state) => {
            const [ welc_content ] = state;

            if(welc_content.introduction) {
                return null;
            };

            return $('<div>').addClass('main__welcome_content').append(
                $('<div>').css({ display: 'flex', justifyContent: 'center', padding: '20px' }).append(
                    $('<div>').addClass('main__welcome_content_text_block').append(
                        $('<span>').css({
                            'font-size': '20px',
                        }).text('Добро пожаловать в документацию'),
    
                        $('<span>').css({
                            'font-size': '25px',
                            'font-weight': 'bold',
                        }).text('Micro Component!'),

                    ), 

                    $('<div>').addClass('main__welcome_content_card').append(
                        $('<span>').css({
                            'font-size': '20px',
                            'font-weight': 'bold',
                            'height': 'max-content',
                            'width': 'max-content'
                        }).text('Реактивность ваших проектов c использованием jQuery!'),

                        $('<div>').css({ margin: '15px' }).append(
                            $('<span>').css({
                                'font-size': '15px',
                                'color': '#0000009c',
                                'height': 'max-content',
                                'width': 'max-content'
                            }).text('Инструмент для легкой интеграции компонетного подхода в новые или существующие проекты с использованием библиотеки jQuery, организация легкой и безопасной мутации стилей для изоляции css без использования препроцессоров c открытым исходным кодом.'),
                        ),

                        $('<div>').css({ margin: '15px' }).append(
                            $('<span>').css({
                                'font-size': '15px',
                                'height': 'max-content',
                                'width': 'max-content'
                            }).text('Micro Component вдохновлён и создан для поддержки и легкой организации шаблонов проектирования архитектуры приложений MVC и MVVM.') 
                        ),

                        $('<div>').css({ margin: '15px' }).append(
                            $('<span>').css({
                                'font-size': '20px',
                                'font-weight': 'bold',
                                'color': 'red',
                                'height': 'max-content',
                                'width': 'max-content'
                            }).text('Важно!')
                        ),

                        $('<div>').css({
                            margin: '15px',
                            'background-color': '#ffdede',
                            padding: '2%',
                            'border-radius': '17px',
                        }).append(
                            $('<span>').css({
                                'font-size': '15px',
                                'height': 'max-content',
                                'width': 'max-content'
                            }).text('Инструмент находится на этапе активной разработки, пожалуйста воздержитесь от использования данного решения в производственном коде пока не будет готова стабильная версия!') 
                        ),


                        $('<div>').addClass('main__welcome_content_card_button_container').append(
                            welc_content.button_array.map(btn => {
                                return $('<div>').addClass('main__welcome_content_card_button').append(
                                    $('<img>').attr('src', btn.srcImg),
                                    $('<span>').html(btn.text)
                                ).on('click', () =>  btn.link())
                            }),
                        )
                    )
                ),

                $.MC(WELCOME_CONTENT, (state) => {
                    const [ preview ] = state;
                    
                    return $('<div>').append(

                    );
                }, [PREVIEW])
            )
                    
        }, [WELC_CONTENT]),
    );
};