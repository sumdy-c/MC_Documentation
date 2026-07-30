/**
 * sign.js — UI для подписания документов через КриптоПро Browser Plugin.
 * Простая jQuery-реализация без сложного state-менеджмента.
 */
$(function () {
    'use strict';

    /* ─────────────────────────────────────────────────────────────
       Стили
    ───────────────────────────────────────────────────────────── */
    $('body').css({ margin: 0, background: '#f0f2f5', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' });

    $('<style>').text(`
        * { box-sizing: border-box; }

        .ds-page {
            min-height: 100vh;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding: 48px 16px;
            background: #f0f2f5;
        }

        .ds-panel {
            width: 100%;
            max-width: 520px;
        }

        /* Шапка */
        .ds-header {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 24px;
        }
        .ds-header__icon {
            width: 46px; height: 46px;
            background: #1a73e8;
            border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 2px 8px rgba(26,115,232,.35);
        }
        .ds-header__icon svg { display: block; }
        .ds-header__text {}
        .ds-header__title {
            font-size: 18px;
            font-weight: 700;
            color: #1a1a2e;
            line-height: 1.2;
            margin: 0 0 2px;
        }
        .ds-header__sub {
            font-size: 12px;
            color: #8a93a8;
            margin: 0;
        }

        /* Карточка-контейнер */
        .ds-card-box {
            background: #fff;
            border-radius: 16px;
            padding: 28px;
            box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.06);
        }

        /* Сертификат */
        .ds-cert-label {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: .6px;
            text-transform: uppercase;
            color: #8a93a8;
            margin-bottom: 10px;
        }
        .ds-cert {
            border: 2px solid #e8ebf0;
            border-radius: 10px;
            padding: 14px 16px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: border-color .15s, background .15s, box-shadow .15s;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .ds-cert:hover { border-color: #aac4f7; background: #f6f9ff; }
        .ds-cert.selected { border-color: #1a73e8; background: #f0f6ff; box-shadow: 0 0 0 3px rgba(26,115,232,.1); }
        .ds-cert__radio {
            width: 18px; height: 18px;
            border: 2px solid #c8cdd8;
            border-radius: 50%;
            flex-shrink: 0;
            display: flex; align-items: center; justify-content: center;
            transition: border-color .15s;
        }
        .ds-cert.selected .ds-cert__radio { border-color: #1a73e8; }
        .ds-cert.selected .ds-cert__radio::after {
            content: '';
            width: 8px; height: 8px;
            background: #1a73e8;
            border-radius: 50%;
        }
        .ds-cert__body { flex: 1; min-width: 0; }
        .ds-cert__name { font-size: 14px; font-weight: 600; color: #1a1a2e; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ds-cert__dates { font-size: 12px; color: #6b7280; margin-bottom: 2px; }
        .ds-cert__thumb { font-size: 11px; color: #b0b7c3; font-family: monospace; }

        /* Кнопки */
        .ds-btn {
            display: block; width: 100%;
            padding: 13px 20px;
            border: none; border-radius: 10px;
            font-size: 14px; font-weight: 600;
            cursor: pointer;
            transition: background .15s, box-shadow .15s, transform .1s;
            margin-top: 20px;
        }
        .ds-btn:active:not(:disabled) { transform: scale(.98); }
        .ds-btn-primary { background: #1a73e8; color: #fff; box-shadow: 0 2px 8px rgba(26,115,232,.35); }
        .ds-btn-primary:hover:not(:disabled) { background: #1557b0; box-shadow: 0 4px 12px rgba(26,115,232,.4); }
        .ds-btn-primary:disabled { background: #c8cdd8; box-shadow: none; cursor: not-allowed; color: #fff; }
        .ds-btn-outline { background: #fff; color: #1a73e8; border: 2px solid #1a73e8; box-shadow: none; }
        .ds-btn-outline:hover { background: #f0f6ff; }

        /* Статусы */
        .ds-status {
            text-align: center;
            padding: 32px 16px;
        }
        .ds-status__icon {
            width: 56px; height: 56px;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 16px;
            font-size: 24px;
        }
        .ds-status__icon--spin {
            border: 3px solid #e8ebf0;
            border-top-color: #1a73e8;
            animation: ds-spin .8s linear infinite;
        }
        .ds-status__icon--ok { background: #e8f5e9; color: #2e7d32; }
        .ds-status__icon--warn { background: #fff3e0; color: #e65100; }
        .ds-status__icon--err { background: #ffebee; color: #c62828; }
        .ds-status__title { font-size: 16px; font-weight: 700; color: #1a1a2e; margin-bottom: 6px; }
        .ds-status__text { font-size: 13px; color: #6b7280; line-height: 1.5; }

        /* Результат */
        .ds-result {
            background: #f6fdf7;
            border: 1.5px solid #a5d6a7;
            border-radius: 10px;
            padding: 16px;
            margin-top: 20px;
        }
        .ds-result__row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid #e8f5e9; font-size: 13px; }
        .ds-result__row:last-child { border-bottom: none; }
        .ds-result__label { color: #6b7280; }
        .ds-result__value { font-weight: 600; color: #1a1a2e; }

        /* Инпут */
        .ds-input { width: 100%; padding: 11px 14px; border: 2px solid #e8ebf0; border-radius: 10px; font-size: 14px; color: #1a1a2e; outline: none; transition: border-color .15s; margin-bottom: 4px; }
        .ds-input:focus { border-color: #1a73e8; }
        .ds-input-label { font-size: 13px; font-weight: 600; color: #4b5563; margin-bottom: 8px; display: block; }

        /* Ссылка */
        .ds-link { color: #1a73e8; text-decoration: none; font-weight: 600; }
        .ds-link:hover { text-decoration: underline; }

        @keyframes ds-spin { to { transform: rotate(360deg); } }
        @keyframes ds-fadein { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .ds-card-box { animation: ds-fadein .25s ease; }
    `).appendTo('head');

    /* ─────────────────────────────────────────────────────────────
       Состояние приложения
    ───────────────────────────────────────────────────────────── */
    var state = {
        step:               'loading',   // loading | no-plugin | enter-id | select-cert | signing | success | error
        documentId:         window.DS_DOCUMENT_ID || 0,
        certificates:       [],
        selectedThumbprint: null,
        result:             null,
        error:              null,
    };

    var $root = $('#root');

    /* ─────────────────────────────────────────────────────────────
       Отрисовка
    ───────────────────────────────────────────────────────────── */
    function makeHeader() {
        var docLabel = state.documentId ? ' #' + state.documentId : '';
        return $('<div>').addClass('ds-header').append(
            $('<div>').addClass('ds-header__icon').append(
                $(
                    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                    '<path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2Z" fill="white" fill-opacity="0.9"/>' +
                    '<path d="M9 12l2 2 4-4" stroke="#1a73e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
                    '</svg>'
                )
            ),
            $('<div>').addClass('ds-header__text').append(
                $('<p>').addClass('ds-header__title').text('Электронная подпись'),
                $('<p>').addClass('ds-header__sub').text(
                    state.documentId ? 'Документ' + docLabel : 'Подписание документа'
                )
            )
        );
    }

    function render() {
        $root.empty();

        var $page  = $('<div>').addClass('ds-page');
        var $panel = $('<div>').addClass('ds-panel');

        $panel.append(makeHeader());

        var $box = $('<div>').addClass('ds-card-box');

        switch (state.step) {
            case 'loading':    $box.append(renderLoading());    break;
            case 'no-plugin':  $box.append(renderNoPlugin());   break;
            case 'enter-id':   $box.append(renderEnterId());    break;
            case 'select-cert': $box.append(renderSelectCert()); break;
            case 'signing':    $box.append(renderSigning());    break;
            case 'success':    $box.append(renderSuccess());    break;
            case 'error':      $box.append(renderError());      break;
        }

        $panel.append($box);
        $page.append($panel);
        $root.append($page);
    }

    function renderLoading() {
        return $('<div>').addClass('ds-status').append(
            $('<div>').addClass('ds-status__icon ds-status__icon--spin'),
            $('<p>').addClass('ds-status__title').text('Инициализация...'),
            $('<p>').addClass('ds-status__text').text('Подключаемся к КриптоПро Browser Plugin')
        );
    }

    function renderNoPlugin() {
        return $('<div>').addClass('ds-status').append(
            $('<div>').addClass('ds-status__icon ds-status__icon--warn').text('⚠'),
            $('<p>').addClass('ds-status__title').text('Плагин не обнаружен'),
            $('<p>').addClass('ds-status__text').text('КриптоПро Browser Plugin не установлен или не поддерживается браузером.'),
            $('<a>')
                .addClass('ds-btn ds-btn-primary')
                .css({ display: 'block', textAlign: 'center', textDecoration: 'none' })
                .attr({ href: 'https://www.cryptopro.ru/products/cades/plugin', target: '_blank' })
                .text('Загрузить плагин')
        );
    }

    function renderEnterId() {
        var $input = $('<input>')
            .addClass('ds-input')
            .attr({ type: 'number', placeholder: 'Введите ID документа', min: '1' });

        var $btn = $('<button>')
            .addClass('ds-btn ds-btn-primary')
            .text('Продолжить')
            .prop('disabled', true);

        $input.on('input', function () {
            $btn.prop('disabled', !$(this).val() || parseInt($(this).val(), 10) <= 0);
        });

        $btn.on('click', function () {
            var id = parseInt($input.val(), 10);
            if (id > 0) {
                state.documentId = id;
                initPlugin();
            }
        });

        return $('<div>').append(
            $('<label>').addClass('ds-input-label').text('ID документа для подписания'),
            $input,
            $btn
        );
    }

    function renderSelectCert() {
        var $div = $('<div>');

        if (state.certificates.length === 0) {
            $div.append(
                $('<div>').addClass('ds-status').append(
                    $('<div>').addClass('ds-status__icon ds-status__icon--warn').text('🔍'),
                    $('<p>').addClass('ds-status__title').text('Сертификаты не найдены'),
                    $('<p>').addClass('ds-status__text').text('Действующие сертификаты в хранилище не обнаружены. Проверьте, что токен с КЭП подключён.')
                )
            );
        } else {
            $div.append(
                $('<p>').addClass('ds-cert-label').text('Выберите сертификат для подписания')
            );
            state.certificates.forEach(function (cert) {
                var isSelected = cert.thumbprint === state.selectedThumbprint;
                var $card = $('<div>').addClass('ds-cert' + (isSelected ? ' selected' : '')).append(
                    $('<div>').addClass('ds-cert__radio'),
                    $('<div>').addClass('ds-cert__body').append(
                        $('<div>').addClass('ds-cert__name').text(cert.name),
                        $('<div>').addClass('ds-cert__dates').text('Действителен с ' + cert.validFrom + ' по ' + cert.validTo),
                        $('<div>').addClass('ds-cert__thumb').text(cert.thumbprint.substring(0, 20) + '...')
                    )
                ).on('click', function () {
                    state.selectedThumbprint = cert.thumbprint;
                    render();
                });
                $div.append($card);
            });
        }

        $div.append(
            $('<button>')
                .addClass('ds-btn ds-btn-primary')
                .text('Подписать документ')
                .prop('disabled', !state.selectedThumbprint)
                .on('click', handleSign)
        );

        return $div;
    }

    function renderSigning() {
        return $('<div>').addClass('ds-status').append(
            $('<div>').addClass('ds-status__icon ds-status__icon--spin'),
            $('<p>').addClass('ds-status__title').text('Подписание...'),
            $('<p>').addClass('ds-status__text').text('Формируем подпись. Если потребуется PIN-код токена — введите его в диалоге КриптоПро.')
        );
    }

    function renderSuccess() {
        var result   = state.result || {};
        var $status  = $('<div>').addClass('ds-status').append(
            $('<div>').addClass('ds-status__icon ds-status__icon--ok').text('✓'),
            $('<p>').addClass('ds-status__title').text('Документ подписан'),
            $('<p>').addClass('ds-status__text').text('Электронная подпись успешно сформирована и сохранена.')
        );

        var $result = $('<div>').addClass('ds-result');

        if (result.signature_id) {
            $result.append(
                $('<div>').addClass('ds-result__row').append(
                    $('<span>').addClass('ds-result__label').text('ID подписи'),
                    $('<span>').addClass('ds-result__value').text(result.signature_id)
                )
            );
        }
        if (result.message) {
            $result.append(
                $('<div>').addClass('ds-result__row').append(
                    $('<span>').addClass('ds-result__label').text('Статус'),
                    $('<span>').addClass('ds-result__value').text(result.message)
                )
            );
        }

        var docId = state.documentId;
        var $links = $('<div>').css({ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }).append(
            $('<a>')
                .addClass('ds-btn ds-btn-primary')
                .css({ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '0' })
                .attr('href', './documents.php?id=' + docId)
                .text('Перейти к документу'),
            $('<a>')
                .addClass('ds-btn ds-btn-outline')
                .css({ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '0' })
                .attr('href', './documents.php')
                .text('Список документов')
        );

        return $('<div>').append($status, $result.children().length ? $result : null, $links);
    }

    function renderError() {
        var docId = state.documentId;
        var $links = $('<div>').css({ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' });

        if (docId > 0) {
            $links.append(
                $('<a>')
                    .addClass('ds-btn ds-btn-primary')
                    .css({ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '0' })
                    .attr('href', './documents.php?id=' + docId)
                    .text('Перейти к документу'),
                $('<a>')
                    .addClass('ds-btn ds-btn-outline')
                    .css({ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '0' })
                    .attr('href', './documents.php')
                    .text('Список документов')
            );
        }

        return $('<div>').append(
            $('<div>').addClass('ds-status').append(
                $('<div>').addClass('ds-status__icon ds-status__icon--err').text('✕'),
                $('<p>').addClass('ds-status__title').text('Ошибка'),
                $('<p>').addClass('ds-status__text').text(state.error || 'Неизвестная ошибка.')
            ),
            $('<button>')
                .addClass('ds-btn ds-btn-outline')
                .text('Попробовать снова')
                .on('click', function () { initPlugin(); }),
            $links
        );
    }

    /* ─────────────────────────────────────────────────────────────
       Логика
    ───────────────────────────────────────────────────────────── */
    function initPlugin() {
        state.step = 'loading';
        render();

        CryptoSigner.isPluginAvailable().then(function (available) {
            if (!available) {
                state.step = 'no-plugin';
                render();
                return;
            }

            return CryptoSigner.getCertificates().then(function (certs) {
                state.step               = 'select-cert';
                state.certificates       = certs;
                state.selectedThumbprint = certs.length > 0 ? certs[0].thumbprint : null;
                render();
            });

        }).catch(function (err) {
            state.step  = 'error';
            state.error = err.message || 'Ошибка инициализации плагина.';
            render();
        });
    }

    function handleSign() {
        var cert = state.certificates.find(function (c) {
            return c.thumbprint === state.selectedThumbprint;
        });

        if (!cert) return;

        state.step = 'signing';
        render();

        // Заглушка PDF для тестирования (реальный PDF — из хранилища)
        var pdfBase64 = btoa('test-pdf-content-' + state.documentId);

        CryptoSigner.signData(pdfBase64, cert.thumbprint).then(function (signResult) {
            return fetch('/app/api/digital-signatures/' + state.documentId + '/sign', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                    signature:   signResult.signature,
                    certificate: signResult.certificate,
                    verified:    signResult.verified,
                    signer_info: signResult.signerInfo,
                }),
            });

        }).then(function (response) {
            if (!response.ok) {
                return response.json().catch(function () { return null; }).then(function (body) {
                    var msg = (body && body.message) ? body.message : ('HTTP ' + response.status);
                    throw new Error(msg);
                });
            }
            return response.json();

        }).then(function (data) {
            state.step   = 'success';
            state.result = data;
            render();

        }).catch(function (err) {
            state.step  = 'error';
            state.error = err.message || 'Ошибка при подписании.';
            render();
        });
    }

    /* ─────────────────────────────────────────────────────────────
       Запуск
    ───────────────────────────────────────────────────────────── */
    if (!state.documentId) {
        state.step = 'enter-id';
        render();
    } else {
        render();
        initPlugin();
    }
});
