from flask import Flask
import numpy as np
import requests
import json
import math
import time, datetime
from urllib import parse
from flask_cors import *
app = Flask(__name__)
CORS(app, supports_credentials=True)


# 获取token
@app.route('/get_token', methods=['GET', 'PUT'])
def get_token():
    # 获取token
    url = "https://117.78.31.209:26335/rest/plat/smapp/v1/oauth/token"
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "grantType": "password",
        "userName": "18126921586",
        "value": "14785236"
    }
    response = requests.put(url, headers=headers, data=json.dumps(data), verify=False)
    token = response.json()['accessSession']
    return token


# AP位置
@app.route("/topo_info")
def topo_info():
    url = "https://117.78.31.209:26335/rest/campuswlantopowebsite/v1/wlantopo/topoinfo"
    token = get_token()
    headers = {
        "Content-Type": "application/json",
        "X-Auth-Token": token,
        "Accept": "application/json"
    }
    data = {
        "id": "540d8574-a743-4cda-a47e-3718b6a4f722",
        "level": 3,
        "type": "floor"
    }
    url = url + "?param="+parse.quote(json.dumps(data))
    res = requests.get(url, headers=headers, verify=False)
    return res.json()


# 终端位置
@app.route("/location")
def terminal_location():
    url = "https://117.78.31.209:26335/rest/campusrtlswebsite/v1/clientlocation/lastlocation"
    token = get_token()
    headers = {
        "Content-Type": "application/json",
        "X-Auth-Token": token,
        "Accept": "application/json"
    }
    data = {
        "id": "540d8574-a743-4cda-a47e-3718b6a4f722",
        "level": 3,
        "type": "floor"
    }
    url = url + "?param="+parse.quote(json.dumps(data))
    res = requests.post(url, headers=headers, verify=False)
    return res.json()


# 健康度趋势
@app.route("/health_trend")
def health_trend():
    url = "https://117.78.31.209:26335/rest/campuswlanqualityservice/v1/expmonitor/rate/basictable"
    token = get_token()
    headers = {
        "Content-Type": "application/json",
        "X-Auth-Token": token,
        "Accept": "application/json"
    }
    begintime = int(time.time() * 1000) - 24 * 1000 * 60 * 60  # 获取1天内的数据
    endtime = int(time.time() * 1000) - 1000
    data = {
        "id": "857b706e-67d9-49c0-b3cd-4bd1e6963c07",  # 深圳站点
        "level": 3,
        "regionType": "site",
        "startTime": str(begintime),
        "endTime": str(endtime),
    }
    url = url + "?param="+parse.quote(json.dumps(data))
    res = requests.get(url, headers=headers, verify=False)
    return res.json()


# 单个维度数据趋势
@app.route("/single_dimension_rate/<type>")
def single_dimension_rate(begintime=0, endtime=0, type="coverage"):
    url = "https://117.78.31.209:26335/rest/campuswlanqualityservice/v1/expmonitor/common/trend"
    token = get_token()
    headers = {
        "Content-Type": "application/json",
        "X-Auth-Token": token,
        "Accept": "application/json"
    }
    if(begintime == 0):
        begintime = int(time.time() * 1000) - 1000 * 60 * 60 * 24
        # begintime = 1625422800000 - 1000 * 60 * 60 * 24 * 6
    if(endtime == 0):
        endtime = int(time.time() * 1000) - 1000
        # endtime = 1625422800000
    data = {
        "id": "857b706e-67d9-49c0-b3cd-4bd1e6963c07", # 深圳站点举例
        "level": 1,
        "regionType": "site",
        "startTime": str(begintime),
        "endTime": str(endtime),
        "metricType": type, #此参数支持六种参数：accessSuccessRate，accessConsume，roam， coverage，capacity，throughput
    }
    url = url + "?param="+parse.quote(json.dumps(data))
    res = requests.get(url, headers=headers, verify=False)
    return res.json()


# 获取截止到timestamp的前一个小时的数据
def get_sd_data(timestamp, type="coverage"):
    # 当前天的前6天的数据
    begintime = timestamp - 1000 * 60 * 60 * 24 * 7
    endtime = timestamp - 1000 * 60 * 60 * 24
    return single_dimension_rate(begintime, endtime, type)['data']['baseline']


@app.route('/get_threshold/<type>')
def get_threshold(type="coverage"):
    nowtime = int(time.time() * 1000)
    # 各个部分占的权重
    wo = 0.3
    wt = 0.3
    ws = 0.4

    data_six = get_sd_data(nowtime, type)
    data_three = []
    data_one = []

    # 前一天和前三天的数据都是前六天数据的子集
    for i in range(24):
        data_one.append(data_six[120+i])
    for i in range(3*24):
        data_three.append(data_six[72+i])

    # 转化为向量存储，以天数分割
    value_one = np.array([dic['value'] for dic in data_one]).reshape(1, 24)
    value_three = np.array([dic['value'] for dic in data_three]).reshape(3, 24)
    value_six = np.array([dic['value'] for dic in data_six]).reshape(6, 24)

    # 计算相同小时内的平均值
    value_one = np.mean(value_one, axis=0)
    value_three = np.mean(value_three, axis=0)
    value_six = np.mean(value_six, axis=0)

    # 代入公式计算预测值和上下阈值
    value_pre = wo * value_one + wt * value_three + ws * value_six
    std_err = np.sqrt(((value_one-value_pre)**2 + (value_three-value_pre)**2 + (value_six-value_pre)**2)/3)
    value_max = value_pre + 3 * std_err
    value_min = value_pre - 3 * std_err

    # 处理极端情况
    value_max[value_max < 0] = 0
    value_max[value_max > 100] = 100
    value_min[value_min < 0] = 0
    value_min[value_min > 100] = 100

    # 与时间合并，转为json格式返回
    timestamp = np.array([dic['timestamp']+1000*60*60*24 for dic in data_one]).reshape(1, 24)
    tem = np.row_stack((timestamp, value_max, value_min)).T
    res = []
    for row in tem:
        dic = {'timestamp': int(row[0]), 'value_max': row[1], 'value_min': row[2]}
        res.append(dic)
    res = {'data': res}
    return json.dumps(res)


if __name__ == '__main__':
    app.run(host="127.0.0.1", port="8899", debug=True)