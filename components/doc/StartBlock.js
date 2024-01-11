const StartBlock = () => {
    return $('<div>').addClass('doc_content_wrapper').append(
        title('🌟 Добро пожаловать в Micro Component!'),
        
        infoBlock(
            $('<span>').addClass('doc_block_text').text('Это вводная информация которую можно пропустить, если вы хотите сразу приступить к изучению вы можете перейти к следующему блоку!')
        ),

        text('В понимании разработчика данного решения, в начале знакомства с любым инструментом любому инженеру нужно потратить немного времени и разобраться для каких целей он нужен, как он может помочь в решении конкретных проблем.'),
        text('Автор внимательно и чутко относимся к вашему времени, поэтому старательно сжал этот блок информации, выделив основные моменты в тезисы:'),
        subTitle(' - Micro Component создан для удобной реогранизации и поддержки уже написанного исходного кода:'),
        text('Это первопричина появления этой библиотеки, и сразу оговоримся - это далеко не значит, что разработка нового ресурса с использованием Micro Component будет ошибкой, даже напротив, с помощью подходов которые она может предложить ваше приложение будет более безопасным и приятным в поддержке.'),
        text('Но данное утверждение нужно для вашего понимания того, почему инструмент построен таким образом, если у вас будут возникать вопросы в ходе исследование документации - другое решение может привести к неспособности интегрирования функционала в проекты, где нет технической, финансовой или иной возможности подключения иных более современных решений.'),
        subTitle(' - Что за возможности?'),
        text('Как основная функция Micro Component брать на себя роль обработчика ваших селекторов, обеспечивая безопасную работу с ними, это значит что вам больше не нужно беспокоиться за изменения которые вы вносите в css, вы уже не потеряете доступ к обрабатываемому селектору, так же вам больше не придётся создавать атрибуты id в узких местах и следить за их уникальностью.'),
        text('Более того, у вас появится возможность использования шаблонизации в вашем проекте, а так же оптимизировать обновление веб страницы и подходом jQuery изолировать ваш css от внешнего воздействия без использования препроцессоров.'),
        subTitle(' - Оптимизация:'),

        alertBlock(
            $('<span>').addClass('doc_block_text').text('На данном этапе не произведены замеры производительности при использовании Micro Component, пожалуйста учитывайте это при использовании библиотеки!')
        ),

        text('Micro Component создавался исходя из правила "Обработка данных, быстрее чем мутирование или извлечение из DOM". Исходя из этого правила библиотека сохраняет ваши элементы не в DOM, а в выделенной памяти, компонентах ( подробно в главе Конейнерезация ), позволяя производить оптимизированное мутирование элементов и минимизировать поиск и получение элемента от вашего HTML.'),
        text('Как пример данная документация полностью обслуживается Micro Component, а из подключений только jQuery. Исходный код библиотеки вы можете изучить на GitHub.'),
        $('<span>').addClass('doc_title').html('💡 Философия'),
        text('Micro Component старается следовать пути максимальной свободы для использования. Вы в состоянии легко применять разный функционал библиотеки разными подходами, и каких-то определённых правил нет, но стоит отметить что потенциал библиотеки будет лучше раскрываться если последовательно начать отделять логику вашей страницы от отображения, в случае Front-End разработки внутреннию обработку логики от DOM.'),
        text('Как правильно можно организовать такое разделение в вашем новом проекте или уже существующем мы обязательно поговорим более предметно в последующих главах документации.'),
        text('Еще вы могли задаться вопросом, - "Почему название библиотеки Micro Component ?". На самом деле в названии кроется важная часть понимания данного инструмента, сейчас его будет сложно полностью раскрыть, но если оговорить смысл в нескольких словах, - "Разделение целостного приложения, на контейнеры с явными зависимостями.", что это означает вы обязательно уже скоро узнаете.'),
        text('Отдельно в этом блоке хотелось бы отметить, что если вы недавно погрузились в веб-разработку или у вас небольшой опыт работы с jQuery, вам будет тяжелее понимать принципы создания веб-ресурса с использованием данного инструмента.'),

        $('<span>').addClass('doc_title').text('🏷️ Позиционирование'),
        text('Хочется отметить как эта библиотека смотрится в соверменном мире. Сейчас большой выбор различных технических решений для разработки, Front-End не стал исключением.'),
        text('И это замечательно! Сегодня можно решать не только много разных задач, но и решать их удобно для конкретного инженера или команды.'),
        text('В свою же очередь, Micro Component стоит не нишевым, а вполне широким инструментом для разработки малых и средних ресурсов, а так же прекрасно будет работать для удобной поддержки уже написанного ранее крупного приложения.'),
        text('Однако, стоит явно отметить эту информацию:'),
        infoBlock(
            $('<span>').addClass('doc_block_text').text('Обратите внимание на планируемый вами размер разрабатываемого веб-приложения. Автор понимает, что jQuery - это проверенное временем решение, а MC при правильном подходе может достаточно его дополнить, но если приложение планируется достаточно объёмным - лучшим решением, на скромную оценку автора, будет обратиться к современным решениям в виде веб-фреймворков.')
        ),
        text('Так же остались уточнения по поводу того, что может правильнее говорить о том что Micro Component - это не библиотека, а плагин для jQuery ? Давайте разберёмся!'),
        text('Сразу стоит определить разницу - ведь плагин тоже библиотека, но она работает дополняя основной инструмент, в свою очередь "библиотека" старается сама решать поставленные ей задачи. Micro Component, работает в целом вне поля jQuery, но пользуется его абстрациями для формирования HTML. Даже просто взглянув на код, можно увидеть достаточно большую разницу в построении веб-страницы, а человек который столкнулся с Micro Component впервые, (допустим ваш коллега) вероятно не сможет самостоятельно без документации понять как она формируется.'),
        text('Так что, я думаю по пути освоения Micro Component вы сами сможете решить для себя, что это - плагин или библиотека!'),
        subTitle('Сейчас же, можно приступать к установке или если вы уже прошли этот этап сразу приступить к изучению инструмента')
    )
}