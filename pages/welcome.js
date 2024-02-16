const WELCOME = MC.createContext();
const WELCOME_CONTENT = MC.createContext();
const version = '0.0.0 (pre-alpha)';

const ANIM_TITLE = MC.createState({
    color: 'black',
    class_container: 'main__welcome_title_container',
    class_text: 'main__welcome_title_logo',
    firstText: 'MC',
    secondText: '',
    leftpos: 35,
});

const LiveText = MC.createState({
    ready: true,
    text: 'Привет! Надеюсь вы хорошо проведёте тут время!'
});

const WELC_CONTENT = MC.createState({
    introduction: false,
    button_array: [
        {
            text: 'Учебник',
            srcImg: './asset/book.png',
            control: 'documentation'
        },
        {
            text: 'API',
            srcImg: './asset/api.png',
            control: 'api'
        },
        {
            text: 'GitHub',
            srcImg: './asset/github.png',
            control: { go: 'https://github.com/sumdy-c/Micro_Component' }
        },
        {
            text: 'Развитие',
            srcImg: './asset/improvement.png',
            control: 'dev'
        }
    ]
});

const WelcomePage = (PAGES, back) => {

    const welc_obj = WELC_CONTENT.get();

    welc_obj.button_array.forEach(btn => {
        if(btn.control.go) {
            btn.link = () => window.location.href = btn.control.go;
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
    if(!back){
        setTimeout(() => {
            setInterval(() => {
                const live_text_obj = LiveText.get();
                live_text_obj.text = getRandomWord();
                LiveText.set(live_text_obj);
            }, 4000);
        }, 4000);
    }

    return $('<div>').addClass('main__welcome').append(
        $((state) => {
            const [ welc_content ] = state;
            return $('<div>').css({ display: 'flex' }).append(
                $('<div>').addClass(!welc_content.introduction ? 'main__welcome_top_bar' : null).append(
                    $('<div>').css({
                        display: 'flex',
                        'align-items': 'center'
                    }).append(
                        $((state) => {
                            const [ anim_title ] = state;
                            return $('<div>').css({ width: 'max-content' }).append(
                                $('<div>').addClass(anim_title.class_container).css({ left: `${anim_title.leftpos}%` }).append(
                                    $('<span>').css({ color: anim_title.color }).addClass(anim_title.class_text).text(`${anim_title.firstText} ${anim_title.secondText}`)
                                )
                            )
                        }, [ANIM_TITLE], WELCOME),
    
                        $((state) => {
                            const [ live_text ] = state;
                            if(!live_text.ready) {
                                return null;
                            };
    
                            return $('<div>').addClass('main__welcome_top_bar_live_text').html(live_text.text)
                            
                        }, [LiveText], WELCOME),
                    ),
                   
                    !welc_content.introduction && $('<div>').css({
                        margin: '0 15px',
                        opacity: '0.6'
                    }).text(version)
                )
            )
        }, [WELC_CONTENT], WELCOME),

        $((state) => {
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
                        $('<div>').css({ 
                            'margin-top': '60px',
                            width: '70%',
                            display: 'flex',
                            'justify-content': 'center'
                        }).append(
                            codeBlock(` npm i jquery-micro_component `)
                        ),
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
                            }).text('Инструмент для легкой интеграции компонетного подхода в новые или существующие проекты с использованием библиотеки jQuery c открытым исходным кодом.'),
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

            )
                    
        }, [WELC_CONTENT], WELCOME_CONTENT),
    );
};