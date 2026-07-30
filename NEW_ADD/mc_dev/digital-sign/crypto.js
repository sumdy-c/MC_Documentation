/**
 * crypto.js — асинхронная обёртка над КриптоПро Browser Plugin (CAdES).
 *
 * Глобальный объект window.CryptoSigner предоставляет:
 *   isPluginAvailable() — Promise<boolean>
 *   getCertificates()   — Promise<Array<{name, thumbprint, validFrom, validTo, certObject}>>
 *   signData(contentBase64, certObject) — Promise<{signature, certificate, verified, signerInfo}>
 */

(function (global) {
    'use strict';

    /**
     * Форматирует дату из строки КриптоПро в читаемый вид.
     * @param {string} dateStr
     * @returns {string}
     */
    function formatDate(dateStr) {
        try {
            return new Date(dateStr).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        } catch (e) {
            return dateStr || '';
        }
    }

    /**
     * Проверяет доступность плагина КриптоПро.
     * @returns {Promise<boolean>}
     */
    async function isPluginAvailable() {
        // Если скрипт плагина не загрузился — объект cadesplugin не определён
        if (typeof cadesplugin === 'undefined') {
            return false;
        }

        var checkPromise = new Promise(function (resolve) {
            // cadesplugin — thenable: нужно дождаться его инициализации,
            // прежде чем вызывать async_spawn
            cadesplugin.then(function () {
                cadesplugin.async_spawn(function* () {
                    try {
                        yield cadesplugin.CreateObjectAsync('CAdESCOM.Store');
                        resolve(true);
                    } catch (e) {
                        resolve(false);
                    }
                });
            }, function () {
                resolve(false);
            });
        });

        // Таймаут 5 секунд на случай если плагин установлен, но не отвечает
        var timeoutPromise = new Promise(function (resolve) {
            setTimeout(function () { resolve(false); }, 5000);
        });

        return Promise.race([checkPromise, timeoutPromise]);
    }

    /**
     * Возвращает список действующих сертификатов из пользовательского хранилища.
     * @returns {Promise<Array<{name: string, thumbprint: string, validFrom: string, validTo: string, certObject: object}>>}
     */
    async function getCertificates() {
        return new Promise(function (resolve, reject) {
            cadesplugin.then(function () {
                cadesplugin.async_spawn(function* () {
                    try {
                        var store = yield cadesplugin.CreateObjectAsync('CAdESCOM.Store');

                        // На Linux с CSP 5.x передача флагов вызывает 0x80070057,
                        // вызов без параметров открывает My/CurrentUser/ReadOnly по умолчанию
                        yield store.Open();

                        var allCerts = yield store.Certificates;
                        var validCerts = yield allCerts.Find(
                            cadesplugin.CAPICOM_CERTIFICATE_FIND_TIME_VALID
                        );
                        var count = yield validCerts.Count;

                        var result = [];
                        for (var i = 1; i <= count; i++) {
                            var cert = yield validCerts.Item(i);

                            var subjectName = yield cert.SubjectName;
                            var thumbprint  = yield cert.Thumbprint;
                            var validFrom   = yield cert.ValidFromDate;
                            var validTo     = yield cert.ValidToDate;

                            // Извлекаем читаемое имя из субъекта (CN=...)
                            var name = subjectName;
                            var cnMatch = subjectName.match(/CN=([^,]+)/i);
                            if (cnMatch) {
                                name = cnMatch[1].trim();
                            }

                            result.push({
                                name:        name,
                                thumbprint:  thumbprint,
                                validFrom:   formatDate(validFrom),
                                validTo:     formatDate(validTo),
                                certObject:  cert,
                            });
                        }

                        yield store.Close();
                        resolve(result);
                    } catch (e) {
                        reject(new Error('Ошибка получения сертификатов: ' + (e.message || String(e))));
                    }
                });
            }, function (err) {
                reject(new Error('Плагин недоступен: ' + (err || '')));
            });
        });
    }

    /**
     * Подписывает данные в формате Base64 выбранным сертификатом.
     * Использует CAdES-X Long Type 1, detached подпись.
     *
     * @param {string} contentBase64 — содержимое документа в Base64
     * @param {string} thumbprint    — отпечаток сертификата (SHA1 hex)
     * @returns {Promise<{signature: string, certificate: string, verified: boolean, signerInfo: object}>}
     */
    async function signData(contentBase64, thumbprint) {
        return new Promise(function (resolve, reject) {
            cadesplugin.then(function () {
                cadesplugin.async_spawn(function* () {
                    var step = 'init';
                    try {
                        step = 'open store';
                        var store = yield cadesplugin.CreateObjectAsync('CAdESCOM.Store');
                        yield store.Open();

                        step = 'get certs';
                        var allCerts = yield store.Certificates;
                        var total    = yield allCerts.Count;
                        var certObject = null;

                        step = 'find cert';
                        for (var i = 1; i <= total; i++) {
                            var c = yield allCerts.Item(i);
                            var t = yield c.Thumbprint;
                            if (t.toUpperCase() === thumbprint.toUpperCase()) {
                                certObject = c;
                                break;
                            }
                        }

                        if (!certObject) {
                            reject(new Error('Сертификат не найден: ' + thumbprint));
                            return;
                        }

                        step = 'read subjectName';
                        var subjectName = yield certObject.SubjectName;
                        step = 'read validFrom';
                        var validFrom   = yield certObject.ValidFromDate;
                        step = 'read validTo';
                        var validTo     = yield certObject.ValidToDate;
                        step = 'export cert';
                        // CAPICOM_ENCODE_BASE64 = 0; используем литерал — константа может быть
                        // undefined если плагин загрузился через нестандартный путь на Linux
                        var certBase64  = yield certObject.Export(0);

                        step = 'create signer';
                        var signer = yield cadesplugin.CreateObjectAsync('CAdESCOM.CPSigner');
                        step = 'set certificate';
                        yield signer.propset_Certificate(certObject);
                        step = 'set checkCertificate';
                        yield signer.propset_CheckCertificate(false);

                        step = 'create signedData';
                        var signedData = yield cadesplugin.CreateObjectAsync('CAdESCOM.CadesSignedData');
                        step = 'set content';
                        yield signedData.propset_Content(contentBase64);

                        step = 'SignCades';
                        var signingTime = new Date();
                        var signature   = yield signedData.SignCades(
                            signer,
                            1,    // CADESCOM_CADES_BES = 1
                            false
                        );

                        step = 'close store';
                        yield store.Close();

                        var signerName = subjectName;
                        var cnMatch = subjectName.match(/CN=([^,]+)/i);
                        if (cnMatch) {
                            signerName = cnMatch[1].trim();
                        }

                        resolve({
                            signature:   signature,
                            certificate: certBase64,
                            verified:    false,
                            signerInfo: {
                                signer_name: signerName,
                                thumbprint:  thumbprint,
                                valid_from:  validFrom,
                                valid_to:    validTo,
                                signed_at:   signingTime.toISOString(),
                            },
                        });
                    } catch (e) {
                        reject(new Error('Ошибка [' + step + ']: ' + (e.message || String(e))));
                    }
                });
            }, function (err) {
                reject(new Error('Плагин недоступен: ' + (err || '')));
            });
        });
    }

    // --- Экспорт глобального объекта ---
    global.CryptoSigner = {
        isPluginAvailable: isPluginAvailable,
        getCertificates:   getCertificates,
        signData:          signData,
    };

}(window));
