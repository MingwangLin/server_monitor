// log
var log = function () {
    console.log(arguments);
};

var ajax = function(url, method, form, response, $target) {
    var request = {
        url: url,
        type: method,
        contentType: 'application/json',
        success: function (r) {
            log('success', $target);
            response(r, $target);
        },
        error: function (err) {
            r = {
                success: false,
                message: '服务器提了一个问题',
                data: err
            }
            log('err', err)
            log('err', url, err);
            response(r, $target);
        }
    };
    if(method === 'post') {
        var data = JSON.stringify(form);
        request.data = data;
    }
    $.ajax(request);
};

var get = function(url, response, $target) {
    var method = 'get';
    var form = {}
    ajax(url, method, form, response, $target);
};

var formatted_time = function(timestamp){
    var a = new Date(timestamp);
    seconds = a.getSeconds();
    minutes = a.getMinutes();
    hours = a.getHours();
    if (seconds < 10) {
      seconds = '0' + seconds;
    };
    if (minutes < 10) {
      minutes = '0' + minutes;
    };
    if (hours < 10) {
      hours = '0' + hours;
    };
    var formatted_time = hours + ":" + minutes + ":" + seconds;
    return formatted_time
    };
