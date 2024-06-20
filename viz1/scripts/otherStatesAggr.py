__author__ = 'Filippo'


import csv
import math
data={}
states={}
percEst = {96: 0.017333969486840014, 97: 0.01240353709601992, 98: 0.008355430929984947, 99: 0.0058735584833746034, 100: 0.00971414414265178, 85: 0.16651208816053642, 86: 0.14821533274365956, 87: 0.12977458722077798, 88: 0.11661542063041454, 89: 0.09793475227603576, 90: 0.07928794253065433, 91: 0.0627998921621507, 92: 0.05122279638251709, 93: 0.03949770571516937, 94: 0.030845738903159465, 95: 0.02361310313605354}


def getStart(s):
    if len(s)==5:
        return int(s[0:2])
    else:
        return 100
def getSpan(s):
    if len(s)==5:
        return int(s[4:])
    else:
        return 105

def num(s):
    try:
        return int(s)
    except ValueError:
        return 1000

with open('SomeOtherStates.csv', 'rb') as csvfile:
    rawData = csv.reader(csvfile)
    j = 0
    headers = rawData.next()
    headers = rawData.next()
    for row in rawData:

        if row[1] not in states.keys():

            states[row[1]]={}
            states[row[1]]["name"]=row[1]
            states[row[1]]["buckets"]=[]
            states[row[1]]["lastBucket"]=[]
            for i in range(85):
               states[row[1]][i]={}

        if row[3]=="Total":
            states[row[1]]["total"] = int(row[4])
        else:

            if num(row[3]) < 85:
                    states[row[1]][int(row[3])]["m"]=int(row[5])

                    states[row[1]][int(row[3])]["f"]=int(row[6])
                    states[row[1]][int(row[3])]["span"]=1
                    states[row[1]][int(row[3])]["start"]=int(row[3])
            else:
                    states[row[1]][getStart(row[3])]={}
                    states[row[1]][getStart(row[3])]["m"]=int(row[5])

                    states[row[1]][getStart(row[3])]["f"]=int(row[6])
                    states[row[1]][getStart(row[3])]["span"]=5
                    states[row[1]][getStart(row[3])]["start"]=getStart(row[3])



    for s in states.keys():
        for i in range(85):
            states[s][i]["perc"] = float(states[s][i]["m"]+states[s][i]["f"])/states[s]["total"]*100
    for s in states.keys():
        states[s]["buckets"]=[]
        for i in range(85):
            states[s]["buckets"].append(states[s][i])
            del states[s][i]


        totm=0
        totf=0
        for i in [85,90,95,100]:
            states[s][i]["perc"] = float(states[s][i]["m"]+states[s][i]["f"])/states[s]["total"]*100

            totm+=(states[s][i]["m"])
            totf+=states[s][i]["f"]
            states[s]["lastBucket"].append(states[s][i])
            del states[s][i]




        states[s]["estimates"]=[]
        #ESTIMATES

        for i in range(85,100):
            x={"start":i,"span":1,"m":int(math.floor(totm*percEst[i])),"f":int(math.floor(totf*percEst[i]))}
            x["perc"]=float(x["m"]+x["f"])/states[s]["total"]*100
            states[s]["estimates"].append(x)
        x={"start":100,"span":5,"m":int(math.floor(totm*percEst[100])),"f":int(math.floor(totf*percEst[100]))}
        x["perc"]=float(x["m"]+x["f"])/states[s]["total"]*100
        states[s]["estimates"].append(x)
        del states[s]["total"]

    data["states"]=[]
    for s in states.keys():
        data["states"].append(states[s])

    import json
    with open('otherStates2014.json', 'wb') as file:
        json.dump(data,file)