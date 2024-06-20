__author__ = 'Filippo'

import csv
import math
data={}
states={}
percEst = {96: 0.017333969486840014, 97: 0.01240353709601992, 98: 0.008355430929984947, 99: 0.0058735584833746034, 100: 0.00971414414265178, 85: 0.16651208816053642, 86: 0.14821533274365956, 87: 0.12977458722077798, 88: 0.11661542063041454, 89: 0.09793475227603576, 90: 0.07928794253065433, 91: 0.0627998921621507, 92: 0.05122279638251709, 93: 0.03949770571516937, 94: 0.030845738903159465, 95: 0.02361310313605354}

def isSingleBuck(s):
    x = int(s)
    if (x < 85):
        return True

    return False

with open('2014Data.csv', 'rb') as csvfile:
    rawData = csv.reader(csvfile)
    j = 0
    headers = rawData.next()
    for row in rawData:


        if row[4] not in states.keys():

            states[row[4]]={}
            states[row[4]]["name"]=row[4]
            states[row[4]]["lastBucket"]={}
            states[row[4]]["estimates"]=[]
            for i in range(85):
               states[row[4]][i]={}
        if isSingleBuck(row[6]):

            if row[5] == "1":

                states[row[4]][int(row[6])]["m"]=int(row[12])
            if row[5] == "2":

                states[row[4]][int(row[6])]["f"]=int(row[12])
        else:

            if row[6]== "85":

                if row[5] == "1":

                    states[row[4]]["lastBucket"]["m"]=int(row[12])

                if row[5] == "2":

                    states[row[4]]["lastBucket"]["f"]=int(row[12])

            if row[6] == "999" and row[5]=="0":

                states[row[4]]["total"]=int(row[12])



    for s in states.keys():
        for i in range(85):
            states[s][i]["perc"] = float(states[s][i]["m"]+states[s][i]["f"])/states[s]["total"]*100
        states[s]["lastBucket"]["perc"] = float(states[s]["lastBucket"]["m"]+states[s]["lastBucket"]["f"])/states[s]["total"]*100
    for s in states.keys():
        states[s]["buckets"]=[]
        for i in range(85):
            states[s][i]["start"] = i
            states[s][i]["span"]=1
            states[s]["buckets"].append(states[s][i])
            del states[s][i]

        #ESTIMATES
        for i in range(85,100):
            x={"start":i,"span":1,"m":int(math.floor(states[s]["lastBucket"]["m"]*percEst[i])),"f":int(math.floor(states[s]["lastBucket"]["f"]*percEst[i]))}
            x["perc"]=float(x["m"]+x["f"])/states[s]["total"]*100
            states[s]["estimates"].append(x)
        x={"start":100,"span":5,"m":int(math.floor(states[s]["lastBucket"]["m"]*percEst[100])),"f":int(math.floor(states[s]["lastBucket"]["f"]*percEst[100]))}
        x["perc"]=float(x["m"]+x["f"])/states[s]["total"]*100
        states[s]["estimates"].append(x)


        states[s]["lastBucket"]["start"] = 85
        states[s]["lastBucket"]["span"] = 20
        states[s]["lastBucket"] = [states[s]["lastBucket"]]
        #states[s]["buckets"].append(states[s]["lastBucket"])
        #del states[s]["lastBucket"]
        del states[s]["total"]
    data["states"]=[]
    for s in states.keys():
        data["states"].append(states[s])

    import json
    with open('population2014US.json', 'wb') as file:
        json.dump(data,file)