class CustomCSS {
  constructor(files) {
    this.CSSfiles = files;
    this.document_style = [];
    this.CSSdocumentsClasses = [];
    this.SCStyleSheet = null;
    this.initCSSClass();
    this.createCssNode();
  }

  hasDuplicatesClassCSS(arr, resparr) {
    return arr.some(function (currentObj, index) {
      return arr.some(function (obj, i) {
        if (i !== index && obj.selectorText === currentObj.selectorText) {
          resparr.push(currentObj.selectorText);
        }
      });
    });
  }

  createCssNode() {
    this.SCStyleSheet = new CSSStyleSheet();
    document.adoptedStyleSheets = [this.SCStyleSheet];
  }

  initCSSClass() {
    const initStyleze = Array.from(document.styleSheets);
    const styleArr = [];
    this.CSSfiles.forEach((userCss) => {
      styleArr.push(
        initStyleze.find((item) => {
          if (item.href && item.href.match(/\/([^\/]+\.css)$/)) {
            return item.href.match(/\/([^\/]+\.css)$/)[1] === userCss;
          }
        })
      );
      this.document_style.push(
        initStyleze.findIndex((item) => {
          if (item.href && item.href.match(/\/([^\/]+\.css)$/)) {
            return item.href.match(/\/([^\/]+\.css)$/)[1] === userCss;
          }
        })
      );
    });

    styleArr.forEach((noValidStyle) => {
      Array.from(noValidStyle.rules).forEach((noValidClasses) => {
        try {
          const noValCSSObj = {};
          noValCSSObj.selectorText = noValidClasses.selectorText;
          noValCSSObj.cssText = noValidClasses.style.cssText;
          this.CSSdocumentsClasses.push(noValCSSObj);
        } catch (e) {}
      });
    });

    const valStyleArr = [];
    this.hasDuplicatesClassCSS(this.CSSdocumentsClasses, valStyleArr);
    if (valStyleArr.length > 1) {
      if (this.settingSC) {
        if (!this.settingSC.offWarn) {
          console.warn(
            `[SC] Обнаружено дублирование CSS классов! Обратите внимание, что это может привести к неправильному поведению страницы`
          );
          console.warn(`[SC] Дубли ${valStyleArr.join(", ")}`);
        }
      } else {
        console.warn(
          `[SC] Обнаружено дублирование CSS классов! Обратите внимание, что это может привести к неправильному поведению страницы`
        );
        console.warn(`[SC] Дубли ${valStyleArr.join(", ")}`);
      }
    }
  }

  /**
   * Создаёт новый уникальный CSS-класс на основе существующего
   * @param {string} className - имя исходного класса без точки ("test_class")
   * @param {string} id - уникальный идентификатор ("testID")
   * @returns {string} - новое имя класса без точки ("test_class-testID")
   */
  cmpCss(className, id) {
    const baseClass = this.CSSdocumentsClasses.find(
      (cls) => cls.selectorText.replace(/^\./, "") === className
    );

    if (!baseClass) {
      console.warn(`[SC] Класс "${className}" не найден в исходных CSS!`);
      return null;
    }

    const newClassName = `${className}-${id}`;

    // заменяем имя анимации на уникальное
    let cssText = baseClass.cssText;
    const animMatch = cssText.match(/animation:\s*([a-zA-Z0-9_-]+)/);
    if (animMatch) {
      const oldAnimName = animMatch[1];
      const newAnimName = `${oldAnimName}-${id}`;

      cssText = cssText.replace(oldAnimName, newAnimName);

      // клонируем keyframes
      const keyframes = Array.from(this.SCStyleSheet.cssRules).find(
        (r) => r.type === CSSRule.KEYFRAMES_RULE && r.name === oldAnimName
      );
      if (keyframes) {
        let keyframesText = keyframes.cssText.replace(oldAnimName, newAnimName);
        this.SCStyleSheet.insertRule(keyframesText);
      }
    }

    const newRule = `.${newClassName} { ${cssText} }`;
    this.SCStyleSheet.insertRule(newRule);

    return newClassName;
  }
}
