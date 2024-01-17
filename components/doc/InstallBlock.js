const InstallBlock = () => {
    return $('<div>').addClass('doc_content_wrapper').append(
        title('Установка'),
        infoBlock(
            subTitle('Во время демонстрационного режима работы библиотеки функциональность использования модулей временно недоступна. ( Попытки импортировать модули, например, с помощью синтаксиса import MC from "...", не дадут ожидаемых результатов в этот период. )')
        ),

        text('Вы можете подключить Micro Component локально'),

        $('<a>').addClass('link').attr('href', './lib/MC.min.js').text('Посмотреть код'),

        text('Или установить с помощью: '),
        $('<a>').addClass('link').attr('href', 'https://www.npmjs.com/package/jquery-micro_component').text('NPM'),

        codeBlock(
            'npm i jquery-micro_component'
        ),

        text('в index.html можно подключить с помощью:'),
        codeBlock('&lt;script src="./node_modules/jquery-micro_component/MC.min.js"&gt;&lt;/script&gt;'),
        text('Далее - инициализируйте MC'),
        codeBlock(
'&lt;script&gt;MC.init();&lt;/script&gt;'
),

        alertBlock(
            text('Обратите внимание, что Micro Component должен быть подключен после jQuery.')
        )

    );
}