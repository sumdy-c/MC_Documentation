const MAIN_FLOW = [
  {
    index: "01",
    title: "state.set(newValue)",
    text: "MC сначала пытается отбросить пустое обновление: ===, быстрый shallow-check и fallback deepEqual.",
    accent: "input",
  },
  {
    index: "02",
    title: "queueMicrotask(batch)",
    text: "Изменённые state попадают в общий pending queue. Последний set по одному state-id побеждает.",
    accent: "queue",
  },
  {
    index: "03",
    title: "Collect dirty states",
    text: "Flush собирает только валидные state, потом сортирует: global → local, а локальные — deep-first.",
    accent: "sort",
  },
  {
    index: "04",
    title: "Mark dirty VDOM",
    text: "Обновляются подписки component / function-container / effect. VDOM и effect дедупятся по ключам.",
    accent: "dirty",
  },
  {
    index: "05",
    title: "Render + Diff + Patch",
    text: "Сначала вычисляется новый output, потом diff.start сравнивает DOM и применяет точечный patch.",
    accent: "dom",
  },
  {
    index: "06",
    title: "Lifecycle + Effects",
    text: "После patch: mounted при реальном connect, updated после mounted, deps-effect — после DOM commit.",
    accent: "life",
  },
];

const LIFECYCLE_ITEMS = [
  {
    name: "render",
    when: "Во время diffingComponent",
    text: "Компонент вызывается до mounted. Сначала строится новый JQ/HTML output, потом запускается diff.start.",
    kind: "neutral",
  },
  {
    name: "mounted",
    when: "После patch и только при isConnected",
    text: "Вызов идёт через reconnectingVDOM. Если узел ещё не в DOM, mounted откладывается до реального подключения.",
    kind: "good",
  },
  {
    name: "updated",
    when: "После diff.start, только если уже был mounted",
    text: "updated вызывается, когда _mountedCalled уже true и текущий HTML реально подключён к DOM.",
    kind: "accent",
  },
  {
    name: "effect (with deps)",
    when: "После DOM commit батча",
    text: "Все dirty effect keys копятся во flush и запускаются только после завершения DOM diff/patch.",
    kind: "good",
  },
  {
    name: "effect (no deps)",
    when: "Сразу при createEffect",
    text: "Это отдельная ветка. Effect без dependency array не ждёт post-DOM phase и стартует сразу.",
    kind: "warn",
  },
  {
    name: "unmounted",
    when: "Во время cleanup компонента",
    text: "При удалении/replace компонента сначала вызывается unmounted, затем очищаются подписки и cleanup effects.",
    kind: "danger",
  },
  {
    name: "effect cleanup",
    when: "После unmounted у компонента",
    text: "Cleanup-функции effect.unmountCaller вызываются на cleanup компонента, после его unmounted.",
    kind: "danger",
  },
];

const PATCH_RULES = [
  {
    left: "nodeType/tag mismatch",
    right: "REPLACE",
  },
  {
    left: "textContent changed",
    right: "TEXT patch",
  },
  {
    left: "comment changed",
    right: "COMMENT patch",
  },
  {
    left: "attributes / class / style",
    right: "Diff отдельно по слоям",
  },
  {
    left: "DOM events",
    right: "remove missing + add missing handlers",
  },
  {
    left: "children with MC stable key",
    right: "Сначала keyed matching",
  },
  {
    left: "children without stable key",
    right: "Позиционный match по остаткам",
  },
  {
    left: "remove/apply order",
    right: "REMOVE справа налево, потом ADD/PATCH",
  },
];

const BATCH_CASES = [
  {
    title: "Два разных state в один тик",
    text: "Оба попадут в один flush. Если один и тот же компонент зависит от обоих, он будет diff-нут один раз с финальными значениями.",
  },
  {
    title: "Один state.set(...) дважды подряд",
    text: "Последнее значение побеждает. В pending queue state-id остаётся один, а value уже перезаписано.",
  },
  {
    title: "Effect внутри flush делает новый set()",
    text: "Текущий flush не ломается. После завершения будет запланирован ещё один microtask-pass.",
  },
];

function createFlowCard(item) {
  return $("<article>")
    .addClass(`mc-arch-flow-card mc-arch-flow-card--${item.accent}`)
    .append(
      $("<div>").addClass("mc-arch-flow-card_index").text(item.index),
      $("<h3>").addClass("mc-arch-flow-card_title").text(item.title),
      $("<p>").addClass("mc-arch-flow-card_text").text(item.text),
    );
}

function createLifecycleItem(item) {
  return $("<article>")
    .addClass(`mc-arch-life-item mc-arch-life-item--${item.kind}`)
    .append(
      $("<div>").addClass("mc-arch-life-item_line"),
      $("<div>").addClass("mc-arch-life-item_dot"),
      $("<div>")
        .addClass("mc-arch-life-item_body")
        .append(
          $("<div>").addClass("mc-arch-life-item_name").text(item.name),
          $("<div>").addClass("mc-arch-life-item_when").text(item.when),
          $("<p>").addClass("mc-arch-life-item_text").text(item.text),
        ),
    );
}

function createRuleRow(item) {
  return $("<div>")
    .addClass("mc-arch-rule-row")
    .append(
      $("<div>").addClass("mc-arch-rule-row_left").text(item.left),
      $("<div>").addClass("mc-arch-rule-row_arrow").text("→"),
      $("<div>").addClass("mc-arch-rule-row_right").text(item.right),
    );
}

function createBatchCard(item) {
  return $("<article>")
    .addClass("mc-arch-batch-card")
    .append(
      $("<h3>").addClass("mc-arch-batch-card_title").text(item.title),
      $("<p>").addClass("mc-arch-batch-card_text").text(item.text),
    );
}

export default class Architecture extends MC {
  constructor() {
    super();
  }

  render({}, { setPage }) {
    return $("<main>")
      .addClass("mc-arch-page")
      .append(
        $("<div>").addClass("mc-arch-bg mc-arch-bg--1"),
        $("<div>").addClass("mc-arch-bg mc-arch-bg--2"),

        $("<div>")
          .addClass("mc-arch-shell")
          .append(
            $("<header>")
              .addClass("mc-arch-topbar")
              .append(
                $("<button>")
                  .addClass("mc-arch-back-btn")
                  .attr("type", "button")
                  .text("Назад")
                  .on("click", () => setPage("main")),

                $("<div>")
                  .addClass("mc-arch-topbar_badges")
                  .append(
                    $("<span>").addClass("mc-arch-badge").text("MC v7.14"),
                    $("<span>").addClass("mc-arch-badge").text("UI Update Lifecycle"),
                    $("<span>").addClass("mc-arch-badge mc-arch-badge--warn").text("code-based"),
                  ),
              ),

            $("<section>")
              .addClass("mc-arch-hero")
              .append(
                $("<div>")
                  .addClass("mc-arch-hero_main")
                  .append(
                    $("<span>").addClass("mc-arch-kicker").text("Runtime Map"),
                    $("<h1>").addClass("mc-arch-title").text("Как MC обновляет интерфейс"),
                    $("<p>")
                      .addClass("mc-arch-subtitle")
                      .text(
                        "Схема реального runtime-пути: когда вызываются render, mounted, updated, effect, unmounted и как MC ведёт себя при нескольких state.set(...) в один тик.",
                      ),
                  ),

                $("<aside>")
                  .addClass("mc-arch-hero_note")
                  .append(
                    $("<div>").addClass("mc-arch-note_label").text("Важное исключение"),
                    $("<div>")
                      .addClass("mc-arch-note_value")
                      .text("effect без dependency array запускается сразу при createEffect, а не после DOM commit."),
                  ),
              ),

            $("<section>")
              .addClass("mc-arch-main-grid")
              .append(
                $("<div>")
                  .addClass("mc-arch-panel")
                  .append(
                    $("<div>")
                      .addClass("mc-arch-panel_head")
                      .append(
                        $("<span>").addClass("mc-arch-section-kicker").text("Main flow"),
                        $("<h2>").addClass("mc-arch-section-title").text("Flush-цикл"),
                      ),

                    $("<div>")
                      .addClass("mc-arch-flow")
                      .append(
                        ...MAIN_FLOW.flatMap((item, index) => {
                          const parts = [createFlowCard(item)];
                          if (index < MAIN_FLOW.length - 1) {
                            parts.push($("<div>").addClass("mc-arch-flow-arrow").text("→"));
                          }
                          return parts;
                        }),
                      ),
                  ),

                $("<div>")
                  .addClass("mc-arch-panel mc-arch-panel--side")
                  .append(
                    $("<div>")
                      .addClass("mc-arch-panel_head")
                      .append(
                        $("<span>").addClass("mc-arch-section-kicker").text("Lifecycle"),
                        $("<h2>").addClass("mc-arch-section-title").text("Точки вызова"),
                      ),

                    $("<div>")
                      .addClass("mc-arch-lifecycle")
                      .append(...LIFECYCLE_ITEMS.map(createLifecycleItem)),
                  ),
              ),

            $("<section>")
              .addClass("mc-arch-bottom-grid")
              .append(
                $("<div>")
                  .addClass("mc-arch-panel")
                  .append(
                    $("<div>")
                      .addClass("mc-arch-panel_head")
                      .append(
                        $("<span>").addClass("mc-arch-section-kicker").text("Patch rules"),
                        $("<h2>").addClass("mc-arch-section-title").text("По каким правилам применяются изменения"),
                      ),

                    $("<div>")
                      .addClass("mc-arch-rules")
                      .append(...PATCH_RULES.map(createRuleRow)),
                  ),

                $("<div>")
                  .addClass("mc-arch-panel")
                  .append(
                    $("<div>")
                      .addClass("mc-arch-panel_head")
                      .append(
                        $("<span>").addClass("mc-arch-section-kicker").text("Concurrency"),
                        $("<h2>").addClass("mc-arch-section-title").text("Если изменить 2 state сразу"),
                      ),

                    $("<div>")
                      .addClass("mc-arch-batch")
                      .append(...BATCH_CASES.map(createBatchCard)),

                    $("<div>")
                      .addClass("mc-arch-batch-code")
                      .append(
                        $("<div>").addClass("mc-arch-batch-code_line").text("> s1.set(A)"),
                        $("<div>").addClass("mc-arch-batch-code_line").text("> s2.set(B)"),
                        $("<div>").addClass("mc-arch-batch-code_line").text("> queueMicrotask(flush)"),
                        $("<div>").addClass("mc-arch-batch-code_line").text("> dirtyVC / dirtyFC / dirtyEffectKeys"),
                        $("<div>").addClass("mc-arch-batch-code_line").text("> one DOM commit"),
                        $("<div>").addClass("mc-arch-batch-code_line").text("> one post-commit effect pass"),
                      ),
                  ),
              ),
          ),
      );
  }
}