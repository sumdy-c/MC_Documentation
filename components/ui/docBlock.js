const infoBlock = (element) => {
    return $('<div>').addClass('ui_info_block').append(
        $('<img>').css({'margin': '10px'}).attr('src', './asset/info.png'),
        element
    )
};

const alertBlock = (element) => {
    return $('<div>').addClass('ui_alert_block').append(
        $('<img>').css({'margin': '10px'}).attr('src', './asset/alert.png'),
        element
    )
}

const codeBlock = (stringCode) => {
    return $('<div>').addClass('ui_code-block').append(
        $('<pre>').append(
            $('<code>')
                .addClass('language-javascript')
                .append(stringCode)
        )
    )
}

const text = (text) => {
    return $('<span>').addClass('doc_text').text(text);
};

const title = (text) => {
    return $('<span>').addClass('doc_title').text(text);
}

const subTitle = (text) => {
    return $('<span>').addClass('doc_subtitle').text(text);
}