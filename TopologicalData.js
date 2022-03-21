//location
var location_len;
var terX = [];
var terY = [];
//var terprobeInfo = [];
var APmac = [];
var signal = [];
var terclientMac = [];
var Terminal_timestamp = [];
var hosts = ['00-00-06-c8-6f-b9', '00-00-15-41-3c-16', '00-00-15-41-3c-46', '00-00-15-41-3c-97', '00-00-21-e2-b5-4e', '00-00-21-e2-b5-5e'
            , '00-00-21-e2-b5-91', '00-00-26-2f-a1-16', '00-00-26-2f-a1-18', '00-00-26-2f-a1-66'];

//apData
var ap_len;
var apX = [];
var apY = [];
var apname = [];
var apMac = [];
var APMacx = [];
var APMacy = [];
function getLocation(){
    $.ajax({
        type: "get",
        url: "http://127.0.0.1:8899/location",
        dataType: "json",
        success: function(data){

            //获取数组数据
            location_len = hosts.length;
            for(var i=0;i<location_len;++i){
                terX[i] = data.data[hosts[i]].x;
                terY[i] = data.data[hosts[i]].y;
                // console.log(i+" x:"+terX[i]+"y:"+terY[i]);
                // form: &#x7b;9c-50-ee-1d-f2-6b&#x3d;-55&#x7d;
                //terprobeInfo[i] = data.data[hosts[i]].probeInfo;
                var temp = data.data[hosts[i]].probeInfo;
                APmac[i] = temp.substring(6, 23);
                signal[i] = temp.substring(29, 32);
                terclientMac[i] = data.data[hosts[i]].clientMac;
                Terminal_timestamp[i] = timestampToTime(data.data[hosts[i]].timestamp/1000);

            }
            //

            //
            //画点
            for (var i=0;i<location_len;++i){
                var x = terX[i]*0.43;
                var y = terY[i]*0.43;
                drawLine(x, y, APMacx[APmac[i]], APMacy[APmac[i]]);
                //console.log("x:"+x+"y:"+y);
                var node = document.createElement("div");
                var img = document.createElement("img");
                var data = document.createElement("em");
                node.appendChild(img);
                node.appendChild(data);

                // 节点属性
                $(node).attr({"width": "20", "height": "20"});

                // 图片属性
                img.src="./pc.png";
                $(img).attr({"width": "20", "height": "20"});

                // 数据展示放里面
                var text = "类型:终端"+"\n\n#终端连接到的AP地址:"+APmac[i]+"\n\n#终端连接AP信号强度:"+signal[i]+"\n\n#终端Mac地址:"+terclientMac[i]+"\n\n#时间点:"+Terminal_timestamp[i];
                data.innerText = text;
                $(data).hide();

                // 气泡框动画效果
                $(node).hover(function() {
                    $(this).find("em").attr("z-index", "100");
                    $(this).find("em").animate({opacity: "show"}, "slow");
                }, function() {
                    $(this).find("em").animate({opacity: "hide"}, "fast");
                });

                // 修改点的坐标
                node.style.position = "absolute";
                node.style.left = x + 'px';
                node.style.top = y + 'px';

                // 设置弹出框的位置
                // data.style.position = "absolute";
                data.style.left = -100 + 'px';
                data.style.top = -200  + 'px';
                // data.style.zIndex = 999;

                document.getElementById("u50").appendChild(node);
            }
        }
    })
}

function getAPlocation(){
    $.ajax({
        type: "get",
        url: "http://127.0.0.1:8899/topo_info",
        async: false,
        dataType: "json",
        success: function(data){
            //console.log(data.resultData.apList.AP);

        //获取数组数据
        ap_len = data.resultData.apList.AP.length;
        for(var i=0;i<ap_len;++i){
            apX[i] = data.resultData.apList.AP[i].x;
            apY[i] = data.resultData.apList.AP[i].y;
            apMac[i] = data.resultData.apList.AP[i].apMac;
            apname[i] = data.resultData.apList.AP[i].name;


        }
        for (var i=0;i<ap_len;++i){
                var x = apX[i]*0.43;
                var y = apY[i]*0.43;
                APMacx[apMac[i]] = x;
                APMacy[apMac[i]] = y;
                var node = document.createElement("div");
                var img = document.createElement("img");
                var data = document.createElement("em");
                node.appendChild(img);
                node.appendChild(data);

                // 节点属性
                $(node).attr({"width": "20", "height": "20"});

                // 图片属性
                img.src="./apimg.png";
                $(img).attr({"width": "20", "height": "20"});

                // 数据展示放里面
                var text = "类型:AP终端"+"\n\n#APMac地址:"+apMac[i]+"\n\n#AP名字:"+apname[i];
                data.innerText = text;
                $(data).hide();

                // 气泡框动画效果
                $(node).hover(function() {
                    $(this).find("em").attr("z-index", "100");
                    $(this).find("em").animate({opacity: "show"}, "slow");
                }, function() {
                    $(this).find("em").animate({opacity: "hide"}, "fast");
                });

                // 修改点的坐标
                node.style.position = "absolute";
                node.style.left = x + 'px';
                node.style.top = y + 'px';

                // 设置弹出框的位置
                // data.style.position = "absolute";
                data.style.left = -100 + 'px';
                data.style.top = -200  + 'px';
                // data.style.zIndex = 999;

                document.getElementById("u50").appendChild(node);
            }
    }})
    // console.log(terY.length, terY);
    // for (i in terY){
    //     console.log(terY[i]);
    // }
}

function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return Y + M + D + h + m;
}

function drawLine(x1, y1, x2, y2){
    var ctx = document.getElementById("u50_img").getContext("2d");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(x1 + 12, y1 +12); // 起点, 可略微调整
    ctx.lineTo(x2 + 12, y2 + 12); // 终点, 可略微调整
    ctx.stroke();
    ctx.save();

    // 以点(200, 200) 为例
   // for(var x = 320; x <= 1000; x += 120) {
   //      for(var y = 320; y <= 500; y += 120) {
   //          ctx.beginPath();
   //          ctx.moveTo(200 + 20, 200 + 20); // 起点, 可略微调整
   //          ctx.lineTo(x + 30, y + 30); // 终点, 可略微调整
   //          ctx.stroke();
   //          ctx.save();
   //      }
   // }
}