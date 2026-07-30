/**
 * documents.js — UI для управления документами (загрузка, просмотр, переход к подписанию).
 * jQuery-реализация без сложного state-менеджмента, в стиле sign.js.
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

        /* Сертификат — label */
        .ds-cert-label {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: .6px;
            text-transform: uppercase;
            color: #8a93a8;
            margin-bottom: 10px;
        }

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

        /* ── Карточка документа ── */
        .ds-doc {
            display: flex;
            align-items: center;
            gap: 14px;
            border: 2px solid #e8ebf0;
            border-radius: 10px;
            padding: 14px 16px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: border-color .15s, background .15s;
        }
        .ds-doc:hover { border-color: #aac4f7; background: #f6f9ff; }
        .ds-doc__icon {
            width: 38px; height: 38px;
            background: #f0f6ff;
            border-radius: 8px;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
            color: #1a73e8;
            font-size: 18px;
        }
        .ds-doc__body { flex: 1; min-width: 0; }
        .ds-doc__title {
            font-size: 14px;
            font-weight: 600;
            color: #1a1a2e;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .ds-doc__meta { font-size: 12px; color: #6b7280; }
        .ds-doc__right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
            flex-shrink: 0;
        }
        .ds-doc__arrow { color: #c8cdd8; font-size: 16px; }

        /* ── Бейдж статуса ── */
        .ds-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
        }
        .ds-badge--draft { background: #f0f2f5; color: #8a93a8; }
        .ds-badge--pending { background: #fff3e0; color: #e65100; }
        .ds-badge--signed { background: #e8f5e9; color: #2e7d32; }

        /* ── Зона загрузки ── */
        .ds-upload {
            border: 2px dashed #c8cdd8;
            border-radius: 10px;
            padding: 24px;
            text-align: center;
            cursor: pointer;
            transition: border-color .15s, background .15s;
            margin-bottom: 20px;
        }
        .ds-upload:hover, .ds-upload.drag { border-color: #1a73e8; background: #f6f9ff; }
        .ds-upload__icon { font-size: 32px; margin-bottom: 8px; }
        .ds-upload__text { font-size: 13px; color: #6b7280; }
        .ds-upload__file { font-size: 13px; font-weight: 600; color: #1a73e8; margin-top: 6px; }
        .ds-upload input[type=file] { display: none; }

        /* ── Детали документа ── */
        .ds-detail-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
        }
        .ds-back {
            background: none;
            border: none;
            cursor: pointer;
            color: #1a73e8;
            font-size: 13px;
            font-weight: 600;
            padding: 0;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .ds-back:hover { text-decoration: underline; }

        .ds-info {
            background: #f8f9fb;
            border-radius: 10px;
            padding: 14px 16px;
            margin-bottom: 20px;
        }
        .ds-info__row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            font-size: 13px;
            border-bottom: 1px solid #e8ebf0;
        }
        .ds-info__row:last-child { border-bottom: none; }
        .ds-info__label { color: #6b7280; }
        .ds-info__value {
            font-weight: 600;
            color: #1a1a2e;
            text-align: right;
            max-width: 60%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        /* ── Подписи ── */
        .ds-sig {
            border: 1px solid #e8ebf0;
            border-radius: 8px;
            padding: 12px 14px;
            margin-bottom: 8px;
            font-size: 13px;
        }
        .ds-sig__name { font-weight: 600; color: #1a1a2e; margin-bottom: 4px; }
        .ds-sig__meta { color: #6b7280; font-size: 12px; }
        .ds-sig__thumb { font-family: monospace; font-size: 11px; color: #b0b7c3; margin-top: 4px; }

        /* ── Разделитель секций в списке ── */
        .ds-section-label {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: .6px;
            text-transform: uppercase;
            color: #8a93a8;
            margin: 20px 0 10px;
        }
        .ds-section-label:first-child { margin-top: 0; }
    `).appendTo('head');

    /* ─────────────────────────────────────────────────────────────
       Состояние
    ───────────────────────────────────────────────────────────── */
    var state = {
        step: 'loading',   // loading | list | uploading | detail | error
        documents: [],
        selectedDoc: null,
        uploadFile: null,
        error: null,
    };

    var $root = $('#root');

    /* ─────────────────────────────────────────────────────────────
       Вспомогательные функции
    ───────────────────────────────────────────────────────────── */
    function formatFileSize(bytes) {
        if (!bytes) return '—';
        if (bytes < 1024) return bytes + ' Б';
        if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' КБ';
        return (bytes / 1024 / 1024).toFixed(1) + ' МБ';
    }

    function statusLabel(status) {
        return { draft: 'Черновик', pending_signatures: 'Ожидает подписей', signed: 'Подписан' }[status] || status;
    }

    function statusClass(status) {
        return { draft: 'ds-badge--draft', pending_signatures: 'ds-badge--pending', signed: 'ds-badge--signed' }[status] || '';
    }

    function formatDate(str) {
        if (!str) return '—';
        return new Date(str).toLocaleDateString('ru-RU');
    }

    /* ─────────────────────────────────────────────────────────────
       Шапка
    ───────────────────────────────────────────────────────────── */
    function makeHeader() {
        var subtitle = state.step === 'detail' && state.selectedDoc
            ? (state.selectedDoc.title || state.selectedDoc.original_file_name || 'Детали документа')
            : 'Список документов';

        return $('<div>').addClass('ds-header').append(
            $('<div>').addClass('ds-header__icon').append(
                $(
                    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8L14 2Z" fill="white" fill-opacity="0.9"/>' +
                    '<polyline points="14,2 14,8 20,8" stroke="#1a73e8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
                    '<line x1="8" y1="13" x2="16" y2="13" stroke="#1a73e8" stroke-width="1.5" stroke-linecap="round"/>' +
                    '<line x1="8" y1="17" x2="16" y2="17" stroke="#1a73e8" stroke-width="1.5" stroke-linecap="round"/>' +
                    '<line x1="8" y1="9" x2="10" y2="9" stroke="#1a73e8" stroke-width="1.5" stroke-linecap="round"/>' +
                    '</svg>'
                )
            ),
            $('<div>').addClass('ds-header__text').append(
                $('<p>').addClass('ds-header__title').text('Документы'),
                $('<p>').addClass('ds-header__sub').text(subtitle)
            )
        );
    }

    /* ─────────────────────────────────────────────────────────────
       Главная функция отрисовки
    ───────────────────────────────────────────────────────────── */
    function render() {
        $root.empty();

        var $page  = $('<div>').addClass('ds-page');
        var $panel = $('<div>').addClass('ds-panel');

        $panel.append(makeHeader());

        var $box = $('<div>').addClass('ds-card-box');

        switch (state.step) {
            case 'loading':   $box.append(renderLoading());   break;
            case 'list':      $box.append(renderList());      break;
            case 'uploading': $box.append(renderUploading()); break;
            case 'detail':    $box.append(renderDetail());    break;
            case 'error':     $box.append(renderError());     break;
        }

        $panel.append($box);
        $page.append($panel);
        $root.append($page);
    }

    /* ─────────────────────────────────────────────────────────────
       Шаги
    ───────────────────────────────────────────────────────────── */
    function renderLoading() {
        return $('<div>').addClass('ds-status').append(
            $('<div>').addClass('ds-status__icon ds-status__icon--spin'),
            $('<p>').addClass('ds-status__title').text('Загрузка...'),
            $('<p>').addClass('ds-status__text').text('Получаем список документов')
        );
    }

    function renderUploading() {
        return $('<div>').addClass('ds-status').append(
            $('<div>').addClass('ds-status__icon ds-status__icon--spin'),
            $('<p>').addClass('ds-status__title').text('Загрузка файла...'),
            $('<p>').addClass('ds-status__text').text('Пожалуйста, подождите')
        );
    }

    function renderError() {
        return $('<div>').append(
            $('<div>').addClass('ds-status').append(
                $('<div>').addClass('ds-status__icon ds-status__icon--err').text('✕'),
                $('<p>').addClass('ds-status__title').text('Ошибка'),
                $('<p>').addClass('ds-status__text').text(state.error || 'Неизвестная ошибка.')
            ),
            $('<button>')
                .addClass('ds-btn ds-btn-outline')
                .text('Попробовать снова')
                .on('click', function () { loadDocuments(); })
        );
    }

    function renderList() {
        var $div = $('<div>');

        /* ── Зона загрузки файла ── */
        var $fileInput = $('<input>').attr({ type: 'file', accept: '.pdf', id: 'ds-file-input' });

        var $uploadZone = $('<div>').addClass('ds-upload').append($fileInput);

        if (state.uploadFile) {
            $uploadZone.append(
                $('<div>').addClass('ds-upload__icon').text('📄'),
                $('<div>').addClass('ds-upload__file').text(state.uploadFile.name)
            );
        } else {
            $uploadZone.append(
                $('<div>').addClass('ds-upload__icon').text('☁'),
                $('<div>').addClass('ds-upload__text').text('Перетащите PDF или нажмите для выбора')
            );
        }

        /* Клик на зону — открыть диалог файла */
        $uploadZone.on('click', function (e) {
            if (!$(e.target).is('input')) {
                $fileInput.trigger('click');
            }
        });

        /* Выбор файла через диалог */
        $fileInput.on('change', function () {
            var file = this.files[0];
            if (file) {
                applyFile(file);
            }
        });

        /* Drag & Drop */
        $uploadZone.on('dragover', function (e) {
            e.preventDefault();
            $(this).addClass('drag');
        });
        $uploadZone.on('dragleave', function () {
            $(this).removeClass('drag');
        });
        $uploadZone.on('drop', function (e) {
            e.preventDefault();
            $(this).removeClass('drag');
            var file = e.originalEvent.dataTransfer.files[0];
            if (file) {
                applyFile(file);
            }
        });

        $div.append($uploadZone);

        /* ── Поле названия документа ── */
        $div.append(
            $('<input>')
                .addClass('ds-input')
                .attr({ type: 'text', placeholder: 'Название документа (опционально)', id: 'ds-title-input' })
        );

        /* ── Кнопка загрузки ── */
        var $uploadBtn = $('<button>')
            .addClass('ds-btn ds-btn-primary')
            .text('Загрузить')
            .prop('disabled', !state.uploadFile)
            .on('click', handleUpload);

        $div.append($uploadBtn);

        /* ── Список документов ── */
        $div.append(
            $('<p>').addClass('ds-section-label').text('Документы')
        );

        if (state.documents.length === 0) {
            $div.append(
                $('<div>').addClass('ds-status').css({ paddingTop: '16px', paddingBottom: '8px' }).append(
                    $('<p>').addClass('ds-status__icon').css({ fontSize: '32px', margin: '0 auto 8px' }).text('📄'),
                    $('<p>').addClass('ds-status__text').text('Нет документов. Загрузите первый PDF.')
                )
            );
        } else {
            state.documents.forEach(function (doc) {
                var $card = $('<div>').addClass('ds-doc').append(
                    $('<div>').addClass('ds-doc__icon').text('📄'),
                    $('<div>').addClass('ds-doc__body').append(
                        $('<div>').addClass('ds-doc__title').text(doc.title || doc.original_file_name || 'Без названия'),
                        $('<div>').addClass('ds-doc__meta').text(
                            (doc.original_file_name || '') + (doc.file_size ? ' • ' + formatFileSize(doc.file_size) : '')
                        )
                    ),
                    $('<div>').addClass('ds-doc__right').append(
                        $('<span>').addClass('ds-badge ' + statusClass(doc.status)).text(statusLabel(doc.status)),
                        $('<span>').addClass('ds-doc__meta').text(
                            (doc.signatures_count != null ? doc.signatures_count + ' подп.' : '') +
                            (doc.created_at ? (doc.signatures_count != null ? ' • ' : '') + formatDate(doc.created_at) : '')
                        ),
                        $('<span>').addClass('ds-doc__arrow').text('›')
                    )
                ).on('click', function () {
                    loadDetail(doc.id);
                });

                $div.append($card);
            });
        }

        return $div;
    }

    function renderDetail() {
        var doc = state.selectedDoc || {};
        var $div = $('<div>');

        /* ── Кнопка назад ── */
        $div.append(
            $('<div>').addClass('ds-detail-header').append(
                $('<button>').addClass('ds-back')
                    .append(
                        $('<span>').text('←'),
                        $('<span>').text(' Назад')
                    )
                    .on('click', function () {
                        state.step = 'list';
                        render();
                    })
            )
        );

        /* ── Информация о документе ── */
        var $info = $('<div>').addClass('ds-info');

        function infoRow(label, value) {
            return $('<div>').addClass('ds-info__row').append(
                $('<span>').addClass('ds-info__label').text(label),
                $('<span>').addClass('ds-info__value').text(value || '—')
            );
        }

        $info.append(
            infoRow('Название', doc.title || doc.original_file_name || '—'),
            infoRow('Файл', doc.original_file_name || '—'),
            infoRow('Размер', formatFileSize(doc.file_size)),
            infoRow('Тип', doc.mime_type || '—')
        );

        /* Статус — вставляем бейдж вместо текста */
        var $statusRow = $('<div>').addClass('ds-info__row').append(
            $('<span>').addClass('ds-info__label').text('Статус'),
            $('<span>').addClass('ds-info__value').append(
                $('<span>').addClass('ds-badge ' + statusClass(doc.status)).text(statusLabel(doc.status))
            )
        );
        $info.append($statusRow);
        $info.append(infoRow('Загружен', formatDate(doc.created_at)));

        $div.append($info);

        /* ── Подписи ── */
        var signatures = doc.signatures || [];
        var sigCount = signatures.length;

        $div.append(
            $('<p>').addClass('ds-cert-label').text('Подписи (' + sigCount + ')')
        );

        if (sigCount === 0) {
            $div.append(
                $('<p>').addClass('ds-status__text').css({ textAlign: 'center', padding: '12px 0 16px' }).text('Документ ещё не подписан')
            );
        } else {
            signatures.forEach(function (sig) {
                var name = (sig.signer_name || 'Неизвестный') + (sig.verified_on_client ? ' ✓' : '');
                var thumb = sig.certificate_thumbprint
                    ? sig.certificate_thumbprint.substring(0, 20) + '...'
                    : null;

                var $sig = $('<div>').addClass('ds-sig').append(
                    $('<div>').addClass('ds-sig__name').text(name),
                    $('<div>').addClass('ds-sig__meta').text('Подписано: ' + (sig.signed_at ? formatDate(sig.signed_at) : '—'))
                );

                if (thumb) {
                    $sig.append(
                        $('<div>').addClass('ds-sig__thumb').text('Отпечаток: ' + thumb)
                    );
                }

                $div.append($sig);
            });
        }

        /* ── Кнопка скачивания подписанного документа ── */
        if (doc.signed_file_path) {
            var $dlBtn = $('<a>')
                .addClass('ds-btn ds-btn-outline')
                .attr({
                    href: '/app/api/digital-signatures/documents/' + doc.id + '/download',
                    download: '',
                })
                .css({ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '20px' })
                .text('Скачать подписанный PDF');
            $div.append($dlBtn);

            var $dlOrigBtn = $('<a>')
                .addClass('ds-btn ds-btn-outline')
                .attr({
                    href: '/app/api/digital-signatures/documents/' + doc.id + '/download?original=true',
                    download: '',
                })
                .css({ display: 'block', textAlign: 'center', textDecoration: 'none', fontSize: '13px', color: '#8a93a8', background: 'none', border: 'none', boxShadow: 'none', marginTop: '4px', cursor: 'pointer' })
                .text('Скачать оригинал');
            $div.append($dlOrigBtn);
        }

        /* ── Кнопка подписания ── */
        var isSigned = doc.status === 'signed';
        var $signBtn = $('<button>')
            .addClass('ds-btn ds-btn-primary')
            .text(isSigned ? 'Документ подписан ✓' : 'Подписать документ')
            .prop('disabled', isSigned)
            .on('click', function () {
                window.location.href = './index.php?id=' + doc.id;
            });

        $div.append($signBtn);

        return $div;
    }

    /* ─────────────────────────────────────────────────────────────
       Логика
    ───────────────────────────────────────────────────────────── */
    function applyFile(file) {
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            alert('Допустимы только файлы в формате PDF.');
            return;
        }
        state.uploadFile = file;
        render();
    }

    function handleUpload() {
        if (!state.uploadFile) return;

        // Читаем title ДО render(), который удалит элемент из DOM
        var title = $('#ds-title-input').val().trim();

        state.step = 'uploading';
        render();

        var formData = new FormData();
        formData.append('file', state.uploadFile);
        if (title) {
            formData.append('title', title);
        }

        fetch('/app/api/digital-signatures/documents', {
            method: 'POST',
            body: formData,
        }).then(function (response) {
            if (!response.ok) {
                return response.json().catch(function () { return null; }).then(function (body) {
                    var msg = (body && body.message) ? body.message : ('HTTP ' + response.status);
                    throw new Error(msg);
                });
            }
            return response.json();
        }).then(function () {
            state.uploadFile = null;
            return loadDocuments();
        }).catch(function (err) {
            state.step = 'error';
            state.error = err.message || 'Ошибка загрузки файла.';
            render();
        });
    }

    function loadDocuments() {
        return fetch('/app/api/digital-signatures/documents')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                state.documents = data;
                state.step = 'list';
                render();
            }).catch(function (err) {
                state.step = 'error';
                state.error = err.message;
                render();
            });
    }

    function loadDetail(id) {
        state.step = 'loading';
        render();
        fetch('/app/api/digital-signatures/documents/' + id)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                state.selectedDoc = data;
                state.step = 'detail';
                render();
            }).catch(function (err) {
                state.step = 'error';
                state.error = err.message;
                render();
            });
    }

    /* ─────────────────────────────────────────────────────────────
       Запуск
    ───────────────────────────────────────────────────────────── */
    var openId = window.DS_OPEN_DOCUMENT_ID || 0;
    if (openId > 0) {
        loadDetail(openId);
    } else {
        loadDocuments();
    }
});
