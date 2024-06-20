import csv

valueForGenre = {}
import csv
for iii in range(1940,2011):
    with open("../data/genresByYear/"+str(iii)+'Genres.csv', 'rb') as csvfile:
        valueForGenre = {}
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        j = 0
        for row in spamreader:
            i = 0
            if j==0 :
                for c in row:
                    valueForGenre[i] = {"name":c.replace("."," ")}
                    i+=1
            else:
                for c in row:
                    valueForGenre[i]["value"]=c
                    i+=1
            j+=1
    res=[]
    for i in valueForGenre.keys():
        res.append([valueForGenre[i]["name"],valueForGenre[i]["value"]])
    print res
    with open("../data/genresByDecade/"+str(iii)+'Genres.csv', 'wb') as csvfile:
        spamwriter = csv.writer(csvfile)
        for d in res:
            spamwriter.writerow(d)
