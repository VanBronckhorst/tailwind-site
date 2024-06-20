__author__ = 'Filippo'

import csv

def comp(x,y):
    return int(float(y[1])-float(x[1]))

res= []
for i in [1940,1950,1960,1970,1980,1990,2000]:
    with open("../data/GenresByDecade/"+str(i)+'sGenres.csv', 'rb') as csvfile:
        res= []
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        j = 0
        for row in spamreader:
            j+=1
            res.append(row)

        ordered=[]


        ordered = sorted(res,cmp=comp)
        print(ordered)
        with open("../data/genresByDecade/"+str(i)+'sGenres.csv', 'wb') as csvfile:
            spamwriter = csv.writer(csvfile)
            for d in ordered:
                spamwriter.writerow(d)