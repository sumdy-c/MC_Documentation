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