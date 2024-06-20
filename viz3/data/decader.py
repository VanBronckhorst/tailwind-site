__author__ = 'Filippo'

data = {'Bee Gees': 1970, 'Patti Page': 1950, 'Alicia Keys': 2000, 'Chicago': 1970, 'Helen Reddy': 1970, 'Diana Ross': 1970, 'Frank Sinatra': 1950, 'Celine Dion': 1990, 'Carpenters': 1970, 'Elvis Presley': 1970, 'Eminem': 2000, 'Taylor Swift': 2000, 'Glenn Miller & His Orchestra': 1940, 'John Denver': 1970, 'Boyzone': 1990, 'Cliff Richard': 1980, 'The Prodigy': 1990, 'Chubby Checker': 1960, 'The Jam': 1980, 'Brenda Lee': 1960, 'Oasis': 1990, 'Elton John': 1970, 'Dinah Shore': 1940, 'Ray Charles': 1960, 'The Platters': 1950, 'Rascal Flatts': 2000, 'Robbie Williams': 1990, 'Kay Kyser & His Orchestra': 1940, 'Michael Jackson': 1990, 'Harry James & His Orchestra': 1940, 'Connie Francis': 1960, 'Bing Crosby': 1940, 'Take That': 1990, 'Duran Duran': 1980, 'Four Aces': 1950, 'Fats Domino': 1950, 'Nickelback': 2000, 'The Beatles': 1960, 'Linkin Park': 2000, 'Carrie Underwood': 2000, "Shakin' Stevens": 1980, 'Wham!': 1980, 'Sammy Kaye & His Orchestra': 1940, 'Bobby Vinton': 1960, 'Pat Boone': 1950, 'The Beach Boys': 1960, 'Marvin Gaye': 1960, 'Mariah Carey': 1990, 'James Brown': 1970, 'Madness': 1980, 'Spice Girls': 1990, 'Stevie Wonder': 1970, 'Kenny Chesney': 2000, 'Nat King Cole': 1950, 'Vaughn Monroe & His Orchestra': 1940, 'Eddie Fisher': 1950, 'Jimmy Dorsey & His Orchestra': 1940, 'Perry Como': 1950, 'Madonna': 1990, 'Kool & The Gang': 1980, 'Toby Keith': 2000, 'Jay-Z': 2000, 'UB40': 1980}

res = {1940:[],1950:[],1960:[],1970:[],1980:[],1990:[],2000:[]}

for a in data.keys():
    res[data[a]].append(a)

print res
