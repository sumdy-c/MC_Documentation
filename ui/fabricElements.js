// === Текст ===
function textP(content) {
  return $("<p>").addClass("text-xs").html(content);
}

function textLead(content) {
  return $("<p>").addClass("lead text-xs").text(content);
}

function textMuted(content) {
  return $("<p>")
    .addClass("text-xxs text-text-muted-light dark:text-text-muted-dark mb-2")
    .text(content);
}

function textSpan(content, extra = "") {
  return $("<span>")
    .addClass("text-xs " + extra)
    .text(content);
}

// === Заголовки ===
function heading1(content) {
  return $("<h1>")
    .addClass("text-2xl font-bold text-text-light dark:text-text-dark")
    .text(content);
}

function heading2(content) {
  return $("<h2>")
    .addClass("text-lg mt-6 font-semibold text-text-light dark:text-text-dark")
    .text(content);
}

function heading3(content) {
  return $("<h3>")
    .addClass("text-base font-semibold text-text-light dark:text-text-dark")
    .text(content);
}

// === Списки ===
function ulList(items) {
  const ul = $("<ul>").addClass("text-xs space-y-1 list-disc pl-4");
  items.forEach((i) => ul.append($("<li>").html(i)));
  return ul;
}

function olList(items) {
  const ol = $("<ol>").addClass("text-xs space-y-1 list-decimal pl-4");
  items.forEach((i) => ol.append($("<li>").html(i)));
  return ol;
}

// === Карточки / блоки ===
function card(contentNodes) {
  return $("<div>")
    .addClass(
      "p-4 rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark"
    )
    .append(contentNodes);
}

function infoBox(title, body) {
  return card([
    $("<h3>")
      .addClass(
        "text-base font-semibold text-text-light dark:text-text-dark mb-2"
      )
      .text(title),
    textP(body),
  ]);
}

// === Код ===
function codeInline(code) {
  return $("<code>")
    .addClass("font-mono bg-code-bg text-white px-1 py-0.5 rounded")
    .text(code);
}

function codeBlock(title, subtitle, code) {
  return $("<div>")
    .addClass(
      "mt-8 p-4 rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-xs"
    )
    .append(
      title &&
        $("<h3>")
          .addClass(
            "mt-0 text-base font-semibold text-text-light dark:text-text-dark"
          )
          .text(title),
      subtitle &&
        $("<p>")
          .addClass(
            "text-xxs text-text-muted-light dark:text-text-muted-dark mb-2"
          )
          .text(subtitle),
      $("<pre>")
        .addClass("bg-gray-800 text-white rounded-md p-2 text-xxs")
        .append($("<code>").addClass("language-js").text(code))
    );
}

// === Кнопки ===
function buttonPrimary(label) {
  return $("<button>")
    .addClass(
      "px-3 py-1.5 rounded-xl bg-primary text-white " +
      "hover:bg-primary-dark hover:shadow-md transition-colors transition-shadow duration-150"
    )
    .text(label);
}

function buttonSecondary(label) {
  return $("<button>")
    .addClass(
      "px-3 py-1.5 rounded-xl bg-secondary text-text-light " + 
      "hover:bg-secondary/80 active:bg-secondary/70 " +
      "transition-colors duration-150"
    )
    .text(label);
}

function buttonOutline(label) {
  return $("<button>")
    .addClass(
      "px-3 py-1.5 rounded-xl border border-border-light dark:border-border-dark " +
      "text-text-light dark:text-text-dark " +
      "hover:bg-gray-200 dark:hover:bg-gray-700 " + // заметный hover
      "active:bg-gray-300 dark:active:bg-gray-600 " + // эффект нажатия
      "transition-colors duration-150" // плавный переход
    )
    .text(label);
}

// === Utility blocks ===
function sectionTitle(text) {
  return $("<div>")
    .addClass("mb-4")
    .append(
      $("<span>").addClass("text-secondary font-semibold text-xs").text(text)
    );
}

function articleWrapper(...children) {
  return $("<article>")
    .addClass(
      "prose prose-xs dark:prose-invert max-w-none prose-a:text-primary hover:prose-a:text-primary/80 selection:bg-blue-900 selection:text-white"
    )
    .append(children);
}

function container(...children) {
  return $("<div>").addClass(`flex-1 lg:pl-4`).append(...children);
}

function spacer(height = "2rem") {
  return $("<div>").css("height", height);
}