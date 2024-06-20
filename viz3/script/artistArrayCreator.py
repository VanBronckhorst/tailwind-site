__author__ = 'Filippo'

''' Only top
import csv

artistsPerYear = {}

for i in range(1940,2011):
    with open("../data/artistsByYear/"+str(i)+'artist.csv', 'rb') as csvfile:
        year=[]
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        spamreader.next()
        for row in spamreader:
            if row[0] != "Artist":
                year.append({"name":row[0].decode('latin-1').encode("utf-8"),"value":row[1]})
        artistsPerYear[i]=year


decadeForTop = {}
topTen = []
for i in [1940,1950,1960,1970,1980,1990,2000]:
    with open("../data/artistsByDecade/"+str(i)+'sArtist.csv', 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        spamreader.next()
        j = 0
        for row in spamreader:
            j+=1
            if j<11:
                topTen.append(row[0])
                decadeForTop[row[0]]=i

print topTen
print len(topTen)


res=[]
perArtist = {}

for i in artistsPerYear.keys():
    yearArray = artistsPerYear[i]
    for art in yearArray:
        if art["name"] in topTen:
            if not(art["name"] in perArtist.keys()):
                perArtist[art["name"]]=[]
            res.append({"name":art["name"],"value":art["value"],"date":i,"decade":decadeForTop[art["name"]]})

for i in range(1940,2011):
    for j in topTen:
        alreadyThere = False
        for k in res:
            if (k["date"]==i and k["name"]==j):
                alreadyThere = True
                break
        if (not alreadyThere):
            res.append({"name":j,"value":"0","date":i,"decade":decadeForTop[j]})

def comparer(x,y):
    return (topTen.index(x["name"]) - topTen.index(y["name"]))*100 - (y["date"]-x["date"])

orderedRes = sorted(res,cmp = comparer)
'''
'''
for i in perArtist.keys():
    res.append(perArtist[i])
'''
import csv

artistsPerYear = {}

for i in range(1940,2011):
    with open("../data/artistsByYear/"+str(i)+'artist.csv', 'rb') as csvfile:
        year=[]
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        spamreader.next()
        for row in spamreader:
            if row[0] != "Artist":
                year.append({"name":row[0].decode('latin-1').encode("utf-8"),"value":row[1]})
        artistsPerYear[i]=year

allData = {}

for year in artistsPerYear.keys():
    for t in artistsPerYear[year]:
        if t["name"] in allData.keys():
            allData[t["name"]].append({"year":year,"value":t["value"]})
        else:
            allData[t["name"]] = [{"year":year,"value":t["value"]}]


import json
with open("../data/allArtistsStaticData", 'w') as csvfile:
    json.dump(allData,csvfile)
