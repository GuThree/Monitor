$(function () {
        $.ajax({
            type: "get",
            url: "http://127.0.0.1:8899/health_trend",
            dataType: "json",
            success: function(data){
                console.log(data.data)
        //获取数组数据
        var coverage_now = document.getElementById("coverage_now");
        var accessSuccessRate_now = document.getElementById("accessSuccessRate_now");
        var accessConsume_now = document.getElementById("accessConsume_now");
        var capacity_now = document.getElementById("capacity_now");


    }
    })

})