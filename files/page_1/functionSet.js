function loadinData(){
    $.ajax({
            type: "get",
            url: "http://127.0.0.1:8899/single_dimension_rate/" + str,
            dataType: "json",
            success: function(data){

        //获取数组数据
        var axis = [];
        for(var i=0;i<24;i++){
            content[i] = data.data.baseline[i].value;
            axis[i] = i;
        }

        var coverage_now = document.getElementById("coverage_now");
        var accessSuccessRate_now = document.getElementById("accessSuccessRate_now");
        var accessConsume_now = document.getElementById("accessConsume_now");
        var capacity_now = document.getElementById("capacity_now");

        //展示
        var chartDom = document.getElementById("u28_div");
        var myChart = echarts.init(chartDom);
        var option;

        option = {
            xAxis: {
                type: 'category',
                data: axis
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

    $.ajax({
            type: "get",
            url: "http://127.0.0.1:8899/health_trend",
            dataType: "json",
            success: function(data){
        //获取数组数据
        var coverage_now = document.getElementById("coverage_now");
        var accessSuccessRate_now = document.getElementById("accessSuccessRate_now");
        var accessConsume_now = document.getElementById("accessConsume_now");
        var capacity_now = document.getElementById("capacity_now");
        coverage_now.innerHTML = data.data.values[23].coverage;
        capacity_now.innerHTML = data.data.values[23].capacity;
        accessConsume_now.innerHTML = data.data.values[23].timeCon;
        accessSuccessRate_now.innerHTML = data.data.values[23].successCon;
    }
    })
}

function loadinThre(){
    $.ajax({
            type: "get",
            url: "http://127.0.0.1:8899/get_threshold/" + str,
            dataType: "json",
            success: function(data){

            //获取数组数据
            var axis = ['前0-6h','前7-12h','前13-18h','前19-24h'];
            for(var i=0;i<24;i++){
                maxx[i] = data.data[i].value_max;
                minn[i] = data.data[i].value_min;
             }
            Compare();
            //展示
            var dom = document.getElementById("u30_div");
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