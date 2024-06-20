__author__ = 'Filippo'

import csv

def nospaces(s):
    res=s
    while res[0]==' ':
        res = res[1::]
    return res

def findName(arr):
    for i in range(1,len(arr)):
        if arr[i]!="":
            res=arr[i]
            break
    res= res.replace(",","")

    if nospaces(res)!="UNNAMED":
        return nospaces(res)
    else:
        res= arr[0]
        res = res[0:2]+"_"+res[2:4]+"/"+res[4:]
        return res

def findRowSpan(arr):
    res = arr[-2]
    res= res.replace(",","")
    try:
        res = int(res)
    except:
        raise AssertionError
    else:
        return res

def lat(s):
    s= s.replace("N","")
    try:
        res = float(s)
    except:
        raise ArithmeticError
    else:
        return res

def lon(s):
    mul=1
    if s.find("W")!=0 :
        mul = -1
    s= s.replace("W","")
    s= s.replace("E","")
    try:
        res = float(s)
    except:
        print(s)
        raise ArithmeticError
    else:
        return mul * res

hurricanes=[]

with open('hurricaneAtl.txt', 'rb') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for row in reader:
        if row[0][0]=="A" or row[0][0]=="C":
            new = {"name": findName(row)}
            new["n"]= findRowSpan(row)
            new["points"]=[]
            new["ocean"]="A"
            max = 0
            min = 5000;
            date = -1
            landfall = False
            for j in range(new["n"]):
                row = reader.next()
                if (date == -1):
                    date = row[0]
                point = {}
                point["date"] = row[0]
                point["hour"] = row[1]
                point["ident"] = row[2]
                if (row[2]==" L"):
                    landfall = True
                point["type"] = row[3]
                point["lat"] = lat(row[4])
                point["lon"] = lon(row[5])
                point["maxSpeed"] = int(row[6])
                if int(row[6])>max:
                    max= int(row[6])
                if int(row[7])>=0:
                    point["pressure"] = int(row[7])
                if int(row[7])<min:
                    min= int(row[7])
                if int(row[8])>=0:
                    point["34NE"] = int(row[8])
                if int(row[9])>=0:
                    point["34SE"] = int(row[9])
                if int(row[10])>=0:
                    point["34SW"] = int(row[10])
                if int(row[11])>=0:
                    point["34NW"] = int(row[11])
                if int(row[12])>=0:
                    point["50NE"] = int(row[12])
                if int(row[13])>=0:
                    point["50SE"] = int(row[13])
                if int(row[14])>=0:
                    point["50SW"] = int(row[14])
                if int(row[15])>=0:
                    point["50NW"] = int(row[15])
                if int(row[16])>=0:
                    point["64NE"] = int(row[16])
                if int(row[17])>=0:
                    point["64SE"] = int(row[17])
                if int(row[18])>=0:
                    point["64SW"] = int(row[18])
                if int(row[19])>=0:
                    point["64NW"] = int(row[19])
                new["points"].append(point)
            new["maxSpeed"] = max
            new["minPress"] = min
            new["startDate"] = date
            new["landfall"] = landfall
            hurricanes.append(new)


import json


with open('hurricaneAtl.json', 'w') as out:
    json.dump({"hurricanes":hurricanes},out,indent=1)