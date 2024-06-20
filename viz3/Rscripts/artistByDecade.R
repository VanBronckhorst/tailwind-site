#============load data
usefulData <- read.csv("C:/wamp/www/viz/project3/app/data/material/usefulData.csv")
#===========clean
usefulData$X10<-gsub('[-x]','0',usefulData$X10)
usefulData$X10<-gsub('^$','0',usefulData$X10)
usefulData$X.<-gsub('-','0',usefulData$X.)
usefulData$CH<-gsub('n/a','1',usefulData$CH)
usefulData[which(is.na(usefulData$High)),'High']<-1



usefulData$X10 <- as.numeric(usefulData$X10)
usefulData$CH <- as.numeric(usefulData$CH)
usefulData$X. <- as.numeric(usefulData$X.)
usefulData$High <- as.numeric(usefulData$High)
#============calculate score
usefulData$score <- usefulData$CH + (usefulData$X10 / usefulData$CH * 10) + (usefulData$X./ usefulData$High)

#=============for each year group the artist summing their score
library(plyr)

year = 1940
while(year<=1999){
  print(year)
  decadeRows = usefulData$Year==year
  subset = usefulData[decadeRows,c('Artist','score')]
  h<-ddply(subset,~Artist,transform,sum=sum(score))
  k<-h[!duplicated(h$Artist),colnames(h)!='score']
  z<-k[order(-k$sum),]
  rownames(z) <- 1:nrow(z)
  assign(paste(as.character(year),'artist',sep=''),z)
  write.table(z, file = paste(as.name(year),"artist.csv",sep=''),sep=",",row.names=FALSE)
  year = year +1
}

#=============for each decade group the artist summing their score
library(plyr)

decade = 1940
while(decade<=1970){
  print(decade)
  decadeRows = usefulData$Year>=decade & usefulData$Year<decade+10
  subset = usefulData[decadeRows,c('Artist','score')]
  rownames(subset) <- 1:nrow(subset)
  h<-ddply(subset,~Artist,transform,sum=sum(score))
  k<-h[!duplicated(h$Artist),colnames(h)!='score']
  z<-k[order(-k$sum),]
  rownames(z) <- 1:nrow(z)
  assign(paste(as.character(decade),'sArtist',sep=''),z)
  write.table(z, file = paste(as.name(decade),"sArtist.csv",sep=''),sep=",",row.names=FALSE)
  decade = decade +10
}
#=========1980
decade=1980
decadeRows = usefulData$Year>=decade & usefulData$Year<decade+10
subset = usefulData[decadeRows,c('Artist','score')]
rownames(subset) <- 1:nrow(subset)
gg<-subset[1:4000,]
jj<-subset[4001:nrow(subset),]
t<-ddply(gg,~Artist,transform,tmp=sum(score))
h<-ddply(jj,~Artist,transform,tmp=sum(score))
o<-t[!duplicated(t$Artist),colnames(t)!='score']
k<-h[!duplicated(h$Artist),colnames(h)!='score']
u<-o[order(-o$tmp),]
z<-k[order(-k$tmp),]
rownames(u) <- 1:nrow(u)
rownames(z) <- 1:nrow(z)

cc<-rbind(u,z)
rownames(cc) <- 1:nrow(cc)
write.table(cc, file = "tmp1980.csv",sep=",",row.names=FALSE)

cc <- read.csv("~/tmp1980.csv", stringsAsFactors=FALSE)
h<-ddply(cc,~Artist,transform,sum=sum(tmp))
k<-h[!duplicated(h$Artist),colnames(h)!='tmp']
z<-k[order(-k$sum),]
rownames(z) <- 1:nrow(z)
write.table(z, file = "1980sArtist.csv",sep=",",row.names=FALSE)
#===nineties
decade=1990
decadeRows = usefulData$Year>=decade & usefulData$Year<decade+10
subset = usefulData[decadeRows,c('Artist','score')]
rownames(subset) <- 1:nrow(subset)
gg<-subset[1:4000,]
jj<-subset[4001:nrow(subset),]
t<-ddply(gg,~Artist,transform,tmp=sum(score))
h<-ddply(jj,~Artist,transform,tmp=sum(score))
o<-t[!duplicated(t$Artist),colnames(t)!='score']
k<-h[!duplicated(h$Artist),colnames(h)!='score']
u<-o[order(-o$tmp),]
z<-k[order(-k$tmp),]
rownames(u) <- 1:nrow(u)
rownames(z) <- 1:nrow(z)

cc<-rbind(u,z)
rownames(cc) <- 1:nrow(cc)
write.table(cc, file = "tmp1980.csv",sep=",",row.names=FALSE)

cc <- read.csv("~/tmp1990.csv", stringsAsFactors=FALSE)
h<-ddply(cc,~Artist,transform,sum=sum(tmp))
k<-h[!duplicated(h$Artist),colnames(h)!='tmp']
z<-k[order(-k$sum),]
rownames(z) <- 1:nrow(z)
write.table(z, file = "1990sArtist.csv",sep=",",row.names=FALSE)
####============twenties
data2000 = assign(paste("artist",year,sep=''),read.csv(paste("C:/wamp/www/viz/project3/app/data/bestArtistsByYear/2000artist.csv",sep=''), stringsAsFactors=FALSE))
for(year in 2001:2010){
  assign(paste("artist",year,sep=''),read.csv(paste("C:/wamp/www/viz/project3/app/data/bestArtistsByYear/",year,"artist.csv",sep=''), stringsAsFactors=FALSE))
  data2000<-rbind(data2000,get(paste("artist",year,sep='')))
}

rownames(data2000) <- 1:nrow(data2000)
h<-ddply(data2000,~Artist,transform,sum=sum(sum))
k<-h[!duplicated(h$Artist),colnames(h)!='score']
z<-k[order(-k$sum),]
z<-z[z$Artist!='Various Artists',]
rownames(z) <- 1:nrow(z)
write.table(z, file = "2000sArtist.csv",sep=",",row.names=FALSE)

