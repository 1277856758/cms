import Vue from 'vue'
//定义时间过滤器
Vue.filter('time', function (value,type) {
    var time = new Date(value * 1000);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    switch (type) {
        case 2:
            return y + '-' + add0(m) + '-' + add0(d);
            break;
        default:
            return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);

    }


});
function add0(m) {
    return m < 10 ? '0' + m : m
}