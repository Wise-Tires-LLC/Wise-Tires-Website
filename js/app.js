// Load Tire Connect Widget
// 
$(document).ready(function(){
    var tireconnectWidgetElement = $('#tireconnect,#tireconnectCompact,#tireconnectOffers,#tireconnectHorizontal');

    tireconnectWidgetElement.each(function(){
        var apiKey = $(this).data('tireConnectKey');
        if (apiKey !== undefined) {
            var id = $(this).attr('id');
            loadWidgetScript(apiKey, id);
        }
        // else: Missing API Key: <div id='tireconnect' data-tire-connect-key='API_KEY'>
    });

    if(tireconnectWidgetElement.length > 0) {
        document.head.insertAdjacentHTML("beforeend", '<style>.tcwlw_horizontal #tcwlw_form_widget {min-width: unset !important;}</style>')
    }

    $('.is-printable-image').on('click', function (evt) {
        evt.preventDefault();
        var url = null;
        var dataUrl = $(evt.currentTarget).data('imageUrl');

        // Check if link has img url as data attribute
        if (dataUrl !== undefined)
        {
            var tempImg = new Image();
            // get absolute url so that we can show it in a new window
            dataUrl = imgPathCheck(dataUrl);
            tempImg.src = dataUrl;
            url = tempImg.src;
        }
        else {
            // If data attr not set then look for an img to get url
            var image = $(evt.currentTarget).find('img');
            url = imgPathCheck(image[0].src);
        }
        printImage(url);
    });
});

function loadWidgetScript(apiKey, id) {
    var widgetElement = $('#'+id);
    var config = {apikey: apiKey, container: id};
    var method = 'init';

    if(id == 'tireconnectCompact') {
        config.layout = 'vertical';
        config.locationDetect = 'auto';
        config.view = 'compact';
        config.redirectUrl = window.location.href;

        method = 'initForm';
    } else if(id == 'tireconnectOffers') {
        config.method = 'initOffers';
    } else if(id == 'tireconnectHorizontal') {
        config.layout = 'horizontal';
        config.locationDetect = 'auto';
        config.view = 'compact';
        config.redirectUrl = window.location.href;

        method = 'initForm';
    }

    var redirectPath = widgetElement.data('tire-connect-path');

    if(redirectPath) {
        config.redirectUrl = '/' + redirectPath;
    }

    var configJson = JSON.stringify(config)

    if(typeof(TCWidget) === 'undefined') {
        var url = "https://app.tireconnect.ca/js/widget.js";
    }

    var script = "TCWidget."+method+"("+configJson+");";

    var scriptTag = loadScript(url);
    scriptTag.addEventListener("load", function() {
        loadInlineScript(script);
    });
}

function loadScript(url) {
    var scriptTag = document.createElement('script');
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", url);
    document.getElementsByTagName("head")[0].appendChild(scriptTag);

    return scriptTag;
}

function loadInlineScript(script) {
    var scriptTag = document.createElement('script');
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.innerHTML = script;
    document.getElementsByTagName("head")[0].appendChild(scriptTag);
}

function printImage(url) {
    var popup = window.open();
    var img = new Image();
    img.src = url;
    popup.document.write(img.outerHTML);
    popup.focus(); //required for IE
    popup.print();
    return false;
}

function imgPathCheck(url) {
    //Check if it is an absolute url, if not append /file
    if (url.search(/(https?:\/\/)/g) !== -1) {
        return url;
    } else {
        return '/file/' + url;
    }
    
}
