setwd("C:/wamp/www/viz/project3/app/Rscripts")
library('rjson')
#===========================normalize artists

singleString <- paste(readLines("../data/artistsStaticData.js"), collapse=" ")
json=strsplit(singleString,'=')[[1]][2]
obj <- fromJSON(json)

map <- new.env(hash=T, parent=emptyenv())#set hashmap of genres 

for(i in 1:length(obj)){
  if(is.null(map[[obj[[i]]$date]])){
    map[[obj[[i]]$date]] = as.numeric(obj[[i]]$value)
  }else{
    map[[obj[[i]]$date]] = map[[obj[[i]]$date]] + as.numeric(obj[[i]]$value)
  }
}
for(i in 1:length(obj)){
  obj[[i]]$value =as.numeric(obj[[i]]$value)/map[[obj[[i]]$date]]*100
}

a<-toJSON(obj)
write(a, "test.json")

#==============normalize genres
singleString <- paste(readLines("../data/genresStaticData.js"), collapse=" ")
json=strsplit(singleString,'=')[[1]][2]
obj <- fromJSON(json)

map <- new.env(hash=T, parent=emptyenv())#set hashmap of genres 

for(i in 1:length(obj)){
  if(is.null(map[[obj[[i]]$date]])){
    map[[obj[[i]]$date]] = as.numeric(obj[[i]]$value)
  }else{
    map[[obj[[i]]$date]] = map[[obj[[i]]$date]] + as.numeric(obj[[i]]$value)
  }
}
for(i in 1:length(obj)){
  obj[[i]]$value =as.numeric(obj[[i]]$value)/map[[obj[[i]]$date]]*100
}

a<-toJSON(obj)
write(a, "test.json")

#====all artists normalization
singleString <- paste(readLines("../data/allArtistsStaticData.js"), collapse=" ")
json=strsplit(singleString,'=')[[1]][2]
obj <- fromJSON(json)

map <- new.env(hash=T, parent=emptyenv())#set hashmap of genres 

for(i in obj){
  if(is.null(map[[as.character(i[[1]]$year)]])){
    map[[as.character(i[[1]]$year)]] = as.numeric(i[[1]]$value)
  }else{
    map[[as.character(i[[1]]$year)]] = map[[as.character(i[[1]]$year)]] + as.numeric(i[[1]]$value)
  }
}
for(i in obj){
  i[[1]]$value =as.numeric(i[[1]]$value)/map[[as.character(i[[1]]$year)]]*100
}

a<-toJSON(obj)
write(a, "test.json")

#print(obj)
#print(as.list(map))
