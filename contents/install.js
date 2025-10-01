class InstallContent extends MC {
  constructor(_p, _s, vdomID) {
    super();
  }

  render() {
    return container(
      $("<div>")
        .append(
          articleWrapper(
            sectionTitle("Установка"),
            heading1("Как начать использовать Micro Component?"),
            textLead(
              "Micro Component можно подключить в проект несколькими способами: через npm или напрямую через скрипт. Выберите подходящий вариант в зависимости от вашего проекта."
            ),

            heading2("Подключение через min.js"),
            textP(
              "Если вы не используете npm, можно подключить Micro Component напрямую через minified скрипт:"
            ),
            spacer(),
            buttonOutline("Получить скрипт").on("click", () => {
              window.open(
                document.location.origin + "/lib/MC.min.js",
                "_blank"
              );
            }),
            codeBlock(
              "Подключение скрипта",
              null,
              `<script src="./MC.min.js"></script>\n<script>MC.init();</script>`
            ),
            spacer(),
            textP(
              "После этого глобальный объект `MicroComponent` станет доступен в вашем проекте. Поскольку MC построен на runtime рендере, вам не стоит беспокоится о сборке вашего web-приложения."
            ),

            // === Раздел: работа со сборщиками — расширённый блок ===
            heading2("Использование MC со сборщиками (Webpack, Vite, Rollup)"),

            infoBox(
              "Особенности работы со сборщиками",
              "Если вы создаёте новый проект с современным сборщиком, обратите внимание: Micro Component (MC) спроектирован главным образом как лёгкая runtime-библиотека для постепенной модернизации legacy-кода на jQuery. Это даёт преимущества по простоте интеграции в существующие проекты, но налагает ограничения при попытке использовать MC как build-time фреймворк. В частности, на текущем этапе MC поставляется в UMD/сборочном виде (minified), а полноценной поддержки ES Modules и build-time tree-shaking пока нет. Для подробной технической интеграции смотрите раздел: <strong>Продвинутая интеграция</strong>"
            ),

            spacer(),

            // Практические рекомендации по интеграции
            heading3("Практические рекомендации по интеграции со сборщиками"),
            textP(
              "Если вы всё же хотите использовать MC в проекте со сборщиком — вот безопасные и проверенные подходы."
            ),

            spacer("1rem"),

            ulList([
              "<strong>Подключайте MC как внешний скрипт:</strong> поместите 'MC.min.js' в папку 'public/' (или аналог) и подключайте через <script> в index.html. Это самый простой и надёжный способ, он не требует преобразования UMD в ESM.",
              "<strong>Делайте MC внешним (external) для сборщика:</strong> объявите `MC` (и, при необходимости, `jQuery`) как external в конфиге сборщика, чтобы не включать их в основной бандл и избежать дублирования библиотек.",
              "<strong>Инициализация после загрузки:</strong> загружайте MC и инициализируйте компоненты после `DOMContentLoaded` или в точке входа вашего приложения, когда DOM готов.",
              "<strong>Один экземпляр jQuery:</strong> убедитесь, что в проекте используется ровно одна версия jQuery — множественные инстансы приводят к конфликтам.",
              "<strong>Копирование в dist:</strong> настройте сборщик (CopyWebpackPlugin, Vite publicDir и т.п.), чтобы `MC.min.js` попадал в итоговую папку публикации.",
            ]),

            codeBlock(
              "Webpack",
              "сделать MC внешним и подключить через index.html",
              `// webpack.config.js (фрагмент)
module.exports = {
  // ...
  externals: {
    jquery: 'jQuery' // не включать jQuery в бандл
  },
  plugins: [
    // настроить копирование MC.min.js в папку сборки (напр., CopyWebpackPlugin)
  ]
};

// index.html
// <script src="/lib/MC.min.js"></script>
// <script src="/bundle.js"></script>`
            ),

            codeBlock(
              "Универсальный метод",
              "динамическая подгрузка MC в runtime",
              `function loadMC(src = '/lib/MC.min.js') {
  if (document.querySelector(\`script[src="\${src}"]\`)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = (e) => reject(e);
    document.head.appendChild(s);
  });
}

// Использование
document.addEventListener('DOMContentLoaded', () => {
  loadMC('/lib/MC.min.js').then(() => {
    // MC загружен, можно инициализировать компоненты
    if (window.MC && typeof window.MC.init === 'function') {
      window.MC.init();
    }
  }).catch(() => {
    console.error('Не удалось загрузить MC');
  });
});`
            ),

            spacer(),

            // Короткие советы по отладке
            heading3("Советы по отладке и распространённые ошибки"),
            ulList([
              "<strong>Пустой глобальный `MC`:</strong> проверьте порядок подключённых скриптов — MC должен быть подключён до кода, который его использует.",
              "<strong>Двойная jQuery:</strong> проверьте `window.jQuery` и `window.$` — конфликтующие версии ломают плагины.",
              "<strong>Пути в production:</strong> убедитесь, что `MC.min.js` корректно копируется и доступен по ожидаемому пути (например, `/lib/MC.min.js`).",
            ]),

            spacer(),

            textMuted(
              'MC планирует расширение и полноценную поддержку build-time рендера для v.1. Для получения подробностей обратитесь в раздел "Развитие".'
            ),
            codeBlock(
              "!!! MC пока не работает с ES Modules до версии v1",
              "Пример будущего использования с ES Modules",
              "import $ from 'jquery';\nimport MC from 'jquery-micro_component';\n\n// Инициализация компонента\nconst app = new MC.init('#app');"
            )
          )
        )
    );
  }
}
