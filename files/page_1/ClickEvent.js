var str="throughput";
var maxx=[];
var minn=[];
var content = [];
var time = [0,0,0,0];

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

function ClickList(i) {

    switch (i) {
        case 0: str="accessSuccessRate";break;
        case 1: str="accessConsume";break;
        case 2: str="coverage";break;
        case 3: str="capacity";break;
        case 4: str="throughput";break;
    }
    maxx=[];
    minn=[];
    content = [];
    time = [0,0,0,0];
    loadinData();
    loadinThre();
}

function ClickFre(f){
    fre=f;
}

function reload(){
    location.reload();
}