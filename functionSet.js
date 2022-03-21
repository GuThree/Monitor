//全局变量
//数据字段
var str="capacity";
//阈值最值
var maxx=[];
var minn=[];
//对应字段数据的值
var content = [];
//时间戳
var timestamp = [];
//四个时段突破阈值次数
var time = [0,0,0,0];

//阈值比较
function Compare(){
    var index=0;
    for (var i=0;i<4;++i) {
        for (var j=0;j<6;++j,++index){
            if (content[index]<minn[index] || content[index]>maxx[index]){
                time[i]++;
            }
        }
    }
}

//找时间戳最小索引
function findMinindex(t){
    var indexMin = 0;
    var tempMin = t[0];
    for(var i = 0; i < t.length; i ++) {
        if (t[i] < tempMin) {
            tempMin = t[i];
            indexMin = i;
        }
    }
    return indexMin;
}

//时间戳转换
function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return Y + M + D + h + m;
}

//基本数据读取
function loadinData(){
    $.ajax({
            type: "get",
            url: "http://127.0.0.1:8899/single_dimension_rate/" + str,
            async: false,
            dataType: "json",
            success: function(data){

        //获取数组数据
        var ts = [];
        var c = [];
        for(var i=0;i<24;i++){
            c[i] = data.data.baseline[i].value;
            ts[i] = data.data.baseline[i].timestamp;
        }

        var indexOfMin;
        indexOfMin = findMinindex(ts);
        for(var i=0;i<24;i++){
            content[i] = c[indexOfMin];
            //console.log(content[i]);
            timestamp[i] = timestampToTime(ts[indexOfMin]/1000);
            indexOfMin++;
            if (indexOfMin == 24){
                indexOfMin = 0;
            }
            //console.log(i+": "+timestamp[i]);
        }

        //展示
        var chartDom = document.getElementById("u6_div");
        var myChart = echarts.init(chartDom);
        var option;
        option = {
            xAxis: {
                type: 'category',
                data: timestamp
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: content,
                type: 'line'
            }]
        };
        option && myChart.setOption(option);
    }

    })


}

//阈值数据读取
function loadinThre(){
    $.ajax({
            type: "get",
            url: "http://127.0.0.1:8899/get_threshold/" + str,
            async: false,
            dataType: "json",
            success: function(data){

            //获取数组数据
            var axis = ['前19-24h','前13-18h','前7-12h','前0-6h'];
            for(var i=0;i<24;i++){
                maxx[i] = data.data[i].value_max;
                minn[i] = data.data[i].value_min;
                //console.log(i+": "+timestampToTime(data.data[i].timestamp/1000));
             }
            Compare();
            //展示
            var dom = document.getElementById("u8_div");
            var myChart = echarts.init(dom);
            var app = {};
            var option;
            option = {
                xAxis: {
                    type: 'category',
                    data: axis,  //横坐标
                },
                yAxis: {
                    max: 6,
                    min: 0,
                    type: 'value'
                },
                series: [{
                    data: time,  //纵坐标
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                }]
            };
            if (option && typeof option === 'object') {
                myChart.setOption(option);
            }
        }
     })
}

//最近一次数据获取
function getNowData(){
    var coverage_now = document.getElementById("coverage_now");
    var accessSuccessRate_now = document.getElementById("accessSuccessRate_now");
    var accessConsume_now = document.getElementById("accessConsume_now");
    var capacity_now = document.getElementById("capacity_now");

    //accessSuccessRate
    $.ajax({
            type: "get",
            url: "http://127.0.0.1:8899/single_dimension_rate/accessSuccessRate",
            dataType: "json",
            success: function(data){

        //获取数组数据
        var ts = [];
        var c = [];
        for(var i=0;i<24;i++){
            c[i] = data.data.baseline[i].value;
            ts[i] = data.data.baseline[i].timestamp;
            //console.log(i+": "+timestampToTime(ts[i]/1000));
        }
        var u;
        var indexOfMin;
        indexOfMin = findMinindex(ts);
        if (indexOfMin == 0){
            u=23;
        }else {
            u=indexOfMin-1;
        }
        accessSuccessRate_now.innerHTML = data.data.baseline[u].value;
    }
    })
    //accessConsume
    $.ajax({
            type: "get",
            url: "http://127.0.0.1:8899/single_dimension_rate/accessConsume",
            dataType: "json",
            success: function(data){
        //获取数组数据
        var ts = [];
        var c = [];
        for(var i=0;i<24;i++){
            c[i] = data.data.baseline[i].value;
            ts[i] = data.data.baseline[i].timestamp;
        }
        var u;
        var indexOfMin;
        indexOfMin = findMinindex(ts);
        if (indexOfMin == 0){
            u=23;
        }else {
            u=indexOfMin-1;
        }
        accessConsume_now.innerHTML = data.data.baseline[u].value;
    }
    })
    //capacity
    $.ajax({
            type: "get",
            url: "http://127.0.0.1:8899/single_dimension_rate/capacity",
            dataType: "json",
            success: function(data){
        //获取数组数据
        var ts = [];
        var c = [];
        for(var i=0;i<24;i++){
            c[i] = data.data.baseline[i].value;
            ts[i] = data.data.baseline[i].timestamp;
            //console.log(i+": "+timestampToTime(ts[i]/1000));
        }
        var u;
        var indexOfMin;
        indexOfMin = findMinindex(ts);
        if (indexOfMin == 0){
            u=23;
        }else {
            u=indexOfMin-1;
        }
        capacity_now.innerHTML = data.data.baseline[u].value;
    }
    })
    //coverage
    $.ajax({
            type: "get",
            url: "http://127.0.0.1:8899/single_dimension_rate/coverage",
            dataType: "json",
            success: function(data){
        //获取数组数据
        var ts = [];
        var c = [];
        for(var i=0;i<24;i++){
            c[i] = data.data.baseline[i].value;
            ts[i] = data.data.baseline[i].timestamp;
        }
        var u;
        var indexOfMin;
        indexOfMin = findMinindex(ts);
        if (indexOfMin == 0){
            u=23;
        }else {
            u=indexOfMin-1;
        }
        coverage_now.innerHTML = data.data.baseline[u].value;
    }
    })
}

function ave24(arr) {
    var s = 0;
    for (var i=arr.length-1; i>=0; i--) {
        s += arr[i];
    }
    var num =s/24;
    return num.toFixed(1);
}
function ave8(arr, u) {
    var s = 0;
    for (var i=0; i<8; ++i) {
        s += arr[u];
        --u;
        if (u == -1){
            u=23;
        }
    }
    var num =s/8;
    return num.toFixed(1);

}
function max24(arr) {
    var s = arr[arr.length-1];
    for (var i=arr.length-2; i>=0; i--) {
        if(arr[i]>s) s=arr[i];
    }
    return s;
}

function DataReport_getdata(){
    var coverage_now = document.getElementById("coverage_now");
    var accessSuccessRate_now = document.getElementById("accessSuccessRate_now");
    var accessConsume_now = document.getElementById("accessConsume_now");
    var capacity_now = document.getElementById("capacity_now");
    var throughput_now = document.getElementById("throughput_now");

    var coverage_avg24 = document.getElementById("coverage_avg24");
    var accessSuccessRate_avg24 = document.getElementById("accessSuccessRate_avg24");
    var accessConsume_avg24 = document.getElementById("accessConsume_avg24");
    var capacity_avg24 = document.getElementById("capacity_avg24");
    var throughput_avg24 = document.getElementById("throughput_avg24");

    var coverage_avg8 = document.getElementById("coverage_avg8");
    var accessSuccessRate_avg8 = document.getElementById("accessSuccessRate_avg8");
    var accessConsume_avg8 = document.getElementById("accessConsume_avg8");
    var capacity_avg8 = document.getElementById("capacity_avg8");
    var throughput_avg8 = document.getElementById("throughput_avg8");

    var coverage_max = document.getElementById("coverage_max");
    var accessSuccessRate_max = document.getElementById("accessSuccessRate_max");
    var accessConsume_max = document.getElementById("accessConsume_max");
    var capacity_max = document.getElementById("capacity_max");
    var throughput_max = document.getElementById("throughput_max");

    var coverage_breaktime = document.getElementById("coverage_breaktime");
    var accessSuccessRate_breaktime = document.getElementById("accessSuccessRate_breaktime");
    var accessConsume_breaktime = document.getElementById("accessConsume_breaktime");
    var capacity_breaktime = document.getElementById("capacity_breaktime");
    var throughput_breaktime = document.getElementById("throughput_breaktime");


    //accessSuccessRate
    $.ajax({
            type: "get",
            url: "http://127.0.0.1:8899/single_dimension_rate/accessSuccessRate",
            dataType: "json",
            success: function(data){
                //获取数组数据
                var ts = [];
                var c = [];
                for(var i=0;i<24;i++){
                    c[i] = data.data.baseline[i].value;
                    ts[i] = data.data.baseline[i].timestamp;
                    //console.log(i+": "+timestampToTime(ts[i]/1000));
                }
                var u;
                var indexOfMin;
                indexOfMin = findMinindex(ts);
                if (indexOfMin == 0){
                    u=23;
                }else {
                    u=indexOfMin-1;
                }

                accessSuccessRate_now.innerHTML = data.data.baseline[u].value;
                accessSuccessRate_avg24.innerHTML = ave24(c);
                accessSuccessRate_avg8.innerHTML = ave8(c, u);
                accessSuccessRate_max.innerHTML = max24(c);

                var xmax = [];
                var xmin = [];
                var breaktime = 0;
                $.ajax({
                        type: "get",
                        url: "http://127.0.0.1:8899/get_threshold/accessSuccessRate",
                        dataType: "json",
                        success: function(data){
                        //获取数组数据
                            for(var i=0;i<24;i++){
                                xmax[i] = data.data[i].value_max;
                                xmin[i] = data.data[i].value_min;
                            }
                            for (var i=0;i<c.length;++i){
                                if (c[i]<xmin[i] || c[i]>xmax[i]){
                                      breaktime++;
                                }
                            }
                            accessSuccessRate_breaktime.innerHTML = breaktime;
                        }
                    })
            }
    })
    //accessConsume
    $.ajax({
            type: "get",
            url: "http://127.0.0.1:8899/single_dimension_rate/accessConsume",
            dataType: "json",
            success: function(data){
                //获取数组数据
                var ts = [];
                var c = [];
                for(var i=0;i<24;i++){
                    c[i] = data.data.baseline[i].value;
                    ts[i] = data.data.baseline[i].timestamp;
                    //console.log(i+": "+timestampToTime(ts[i]/1000));
                }
                var u;
                var indexOfMin;
                indexOfMin = findMinindex(ts);
                if (indexOfMin == 0){
                    u=23;
                }else {
                    u=indexOfMin-1;
                }

                accessConsume_now.innerHTML = data.data.baseline[u].value;
                accessConsume_avg24.innerHTML = ave24(c);
                accessConsume_avg8.innerHTML = ave8(c, u);
                accessConsume_max.innerHTML = max24(c);

                var xmax = [];
                var xmin = [];
                var breaktime = 0;
                $.ajax({
                        type: "get",
                        url: "http://127.0.0.1:8899/get_threshold/accessConsume",
                        dataType: "json",
                        success: function(data){
                        //获取数组数据
                            for(var i=0;i<24;i++){
                                xmax[i] = data.data[i].value_max;
                                xmin[i] = data.data[i].value_min;
                            }
                            for (var i=0;i<c.length;++i){
                                if (c[i]<xmin[i] || c[i]>xmax[i]){
                                      breaktime++;
                                }
                            }
                            accessConsume_breaktime.innerHTML = breaktime;
                        }
                    })

            }
    })
    //capacity
    $.ajax({
            type: "get",
            url: "http://127.0.0.1:8899/single_dimension_rate/capacity",
            dataType: "json",
            success: function(data){
                //获取数组数据
                var ts = [];
                var c = [];
                for(var i=0;i<24;i++){
                    c[i] = data.data.baseline[i].value;
                    ts[i] = data.data.baseline[i].timestamp;
                    //console.log(i+": "+timestampToTime(ts[i]/1000));
                }
                var u;
                var indexOfMin;
                indexOfMin = findMinindex(ts);
                if (indexOfMin == 0){
                    u=23;
                }else {
                    u=indexOfMin-1;
                }

                capacity_now.innerHTML = data.data.baseline[u].value;
                capacity_avg24.innerHTML = ave24(c);
                capacity_avg8.innerHTML = ave8(c, u);
                capacity_max.innerHTML = max24(c);

                var xmax = [];
                var xmin = [];
                var breaktime = 0;
                $.ajax({
                        type: "get",
                        url: "http://127.0.0.1:8899/get_threshold/capacity",
                        dataType: "json",
                        success: function(data){
                        //获取数组数据
                            for(var i=0;i<24;i++){
                                xmax[i] = data.data[i].value_max;
                                xmin[i] = data.data[i].value_min;
                            }
                            for (var i=0;i<c.length;++i){
                                if (c[i]<xmin[i] || c[i]>xmax[i]){
                                      breaktime++;
                                }
                            }
                            capacity_breaktime.innerHTML = breaktime;
                        }
                    })

            }
    })
    //coverage
    $.ajax({
            type: "get",
            url: "http://127.0.0.1:8899/single_dimension_rate/coverage",
            dataType: "json",
            success: function(data){
                //获取数组数据
                var ts = [];
                var c = [];
                for(var i=0;i<24;i++){
                    c[i] = data.data.baseline[i].value;
                    ts[i] = data.data.baseline[i].timestamp;
                }
                var u;
                var indexOfMin;
                indexOfMin = findMinindex(ts);
                if (indexOfMin == 0){
                    u=23;
                }else {
                    u=indexOfMin-1;
                }
                coverage_now.innerHTML = data.data.baseline[u].value;
                coverage_avg24.innerHTML = ave24(c);
                coverage_avg8.innerHTML = ave8(c, u);
                coverage_max.innerHTML = max24(c);

                var xmax = [];
                var xmin = [];
                var breaktime = 0;
                $.ajax({
                        type: "get",
                        url: "http://127.0.0.1:8899/get_threshold/coverage",
                        dataType: "json",
                        success: function(data){
                        //获取数组数据
                            for(var i=0;i<24;i++){
                                xmax[i] = data.data[i].value_max;
                                xmin[i] = data.data[i].value_min;
                            }
                            for (var i=0;i<c.length;++i){
                                if (c[i]<xmin[i] || c[i]>xmax[i]){
                                      breaktime++;
                                }
                            }
                            coverage_breaktime.innerHTML = breaktime;
                        }
                    })

            }
    })
    //throughput
    $.ajax({
            type: "get",
            url: "http://127.0.0.1:8899/single_dimension_rate/throughput",
            dataType: "json",
            success: function(data){
                //获取数组数据
                var ts = [];
                var c = [];
                for(var i=0;i<24;i++){
                    c[i] = data.data.baseline[i].value;
                    ts[i] = data.data.baseline[i].timestamp;
                }
                var u;
                var indexOfMin;
                indexOfMin = findMinindex(ts);
                if (indexOfMin == 0){
                    u=23;
                }else {
                    u=indexOfMin-1;
                }
                //
                throughput_now.innerHTML = data.data.baseline[u].value;
                throughput_avg24.innerHTML = ave24(c);
                throughput_avg8.innerHTML = ave8(c, u);
                throughput_max.innerHTML = max24(c);

                var xmax = [];
                var xmin = [];
                var breaktime = 0;
                $.ajax({
                        type: "get",
                        url: "http://127.0.0.1:8899/get_threshold/throughput",
                        dataType: "json",
                        success: function(data){
                        //获取数组数据
                            for(var i=0;i<24;i++){
                                xmax[i] = data.data[i].value_max;
                                xmin[i] = data.data[i].value_min;
                            }
                            for (var i=0;i<c.length;++i){
                                if (c[i]<xmin[i] || c[i]>xmax[i]){
                                      breaktime++;
                                }
                            }
                            throughput_breaktime.innerHTML = breaktime;
                        }
                    })

            }
    })

    //


}

//