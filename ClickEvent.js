

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
    timestamp = [];
    loadinData();
    loadinThre();
}

function ToBasePage(i){
    window.location.replace('主页.html');
}