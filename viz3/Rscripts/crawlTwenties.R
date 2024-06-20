library('RCurl')
library('rjson')
setwd("C:/wamp/www/viz/project3/app/Rscripts")

apiKeys<-c('lj2wDSnKFryhnv5MDQBaizLRGoD4b3mW',
           'UAihH6xCMyX9SZnUsMMG9y3hw40hvdwI',
           'aMloVVFACa6T7e1sNnhZN1au9mOAolGp',
           'D2jJNdkHPa4aiXutyNhcXM0Pcdv3AknI',
           'tALZxK9D0J2CUGSMpy4CvBbZK6yEyLY6')

baseLink<-'https://www.kimonolabs.com/api/ondemand/8wq6q42q?apikey='
startYear<-2000
endYear<-2014
for(y in startYear:endYear){
  #=====================get the names of best artists of the year
  apiK<-apiKeys[1]
  apiKeys<-append(apiKeys[-1],apiKeys[1])#rotate key
  year<-y
  link<-paste(baseLink,apiK, '&kimpath3=',year, sep = "")
  json <- getURL(link)
  obj <- fromJSON(json)
  #print(obj)
  names <-list()
  for(i in 1:obj$count){
    names<-append(names,obj$results$collection1[[i]]$artist$text)
  }
  #==============remove duplicated artists
  names<-unique(names)
  #==============give 'em a score based on the scores of 1999
  #get artists name from nameList
  artists<-data.frame(t(data.frame(names)))
  artists<-setNames(artists,'name')
  artists<-as.data.frame(artists[artists$name!='Soundtrack',])
  row.names(artists)<- 1:nrow(artists)
  #get data 1999
  `1999artist` <- read.csv("C:/wamp/www/viz/project3/app/data/artistsByYear/1999artist.csv", stringsAsFactors=FALSE)
  #trim to the size of names
  scores<- as.data.frame(`1999artist`[1:nrow(artists),'sum'] )
  scores<-setNames(scores,1:ncol(scores))
  #combine artist and scores
  combined<-cbind(artists, scores)
  combined<-setNames(combined,c('Artist','sum'))
  write.table(combined,paste(as.name(y),"artist.csv",sep=''),sep=',',row.names = FALSE)
}
#https://www.kimonolabs.com/api/ondemand/8wq6q42q?apiKey=lj2wDSnKFryhnv5MDQBaizLRGoD4b3mW&kimpath3=2009