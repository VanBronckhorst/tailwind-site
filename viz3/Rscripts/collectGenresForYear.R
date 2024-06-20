library('RCurl')
library('rjson')
#-----------------UTILITY------------------
deUnicodefy<-function(tmpName){
  ts = c("&","À","Å","Æ","Ç","È","Ë","Ì","Ï","Ð","Ñ","Ò","Ö","Ø","×","Ù","Ü","Ý","ß","à","å","ã","æ","ç","è","é","ë","ì","í","ï","ð","ñ","ò","ó","ô","ö","ø","÷","ù","ü","ý","ÿ");
  tn = c("and","A","A","AE","C","E","E","I","I","D","N","O","O","O","X","U","U","Y","Y","a","a","a","ae","c","e","e","e","i","i","i","d","n","o","o","o","o","o","x","u","u","y","y");
  for(s in ts){
    tmpName=gsub(s,tn[which(ts==s)], tmpName);
  }
  return (tmpName)
}
#---------------------------------------------KEYS
nestKeys = c('CFLBFVAPYPMUYTTSR','QVJX27LZP1Q9GYBYV','45PFVVAQZQJD5BIV5','PKT63BEXLXWEDVVKE','ZTFPNPKXWOQAHAG2G')
#=========================set global vars
statusError=list()
noArtistError=list()
noGenresError=list()
startYear=2000
for(year in startYear:2010){
  print(year)
  map <- new.env(hash=T, parent=emptyenv())#set hashmap of genres 
  #at the beginning of each decade reset the map of genresForDecade
  if( year%%10 == 0){
    mapForDecade = new.env(hash = T,parent = emptyenv())
  }
  tmp<-assign(paste("artist",year,sep=''),read.csv(paste("C:/wamp/www/viz/project3/app/data/artistsByYear/",year,"artist.csv",sep=''), stringsAsFactors=FALSE))
  namesId = tmp[,'Artist']
  
  #==========================for each artist find his genres
  baseLinkNest<-'http://developer.echonest.com/api/v4/artist/search?api_key='
  for(name in namesId){
    apiKNest<-nestKeys[1]
    nestKeys=append(nestKeys[-1],nestKeys[1]) # rotate keys
    tmpName<-gsub(" ", "%20", name)
    tmpName<- deUnicodefy(tmpName)
    linkNest<-paste(baseLinkNest,apiKNest,'&format=json','&name=',tmpName,'&bucket=genre&results=1', sep = "")
    jsonNest <- getURL(linkNest)
    objNest <- fromJSON(jsonNest)
    #print(objNest)
    #if there is a response, for each genre add a a score which is 
    #the popularity of the artist
    if(objNest$response$status$code==0){
      if( length(objNest$response$artists)>0){
        if(length(objNest$response$artists[[1]]$genres) > 0){
          for(i in 1:length(objNest$response$artists[[1]]$genres)){
            genreName<- objNest$response$artists[[1]]$genres[[i]]$name
            score = tmp[tmp$Artist==name,'sum']
            if(is.null(map[[genreName]])){
              map[[genreName]] = score
            }else{
              map[[genreName]] = map[[genreName]]+score
            }
           #print(as.list(map))
            if(is.null(mapForDecade[[genreName]])){
              mapForDecade[[genreName]]=score
            }else{
              mapForDecade[[genreName]] = mapForDecade[[genreName]]+score
            }
          }
        }else{
          noGenresError = append(noGenresError,list(append(name,linkNest)))
        }
      }else{
        noArtistError = append(noArtistError,list(append(name,linkNest)))
      }
    }else{
      statusError=append(statusError,list(append(name,linkNest)))
    }
  }
  assign(as.character(year),as.data.frame(as.list(map)))
  write.table(as.data.frame(as.list(map)), file = paste(as.name(year),"Genres.csv",sep=''),sep=",",row.names=FALSE)
  #if next year it changes the decade
  if( (year+1)%%10 == 0){
    assign(paste(as.character(year-9),"s",sep=''),as.data.frame(as.list(mapForDecade)))
    write.table(as.data.frame(as.list(mapForDecade)), file = paste(as.name(year-9),"sGenres.csv",sep=''),sep=",",row.names=FALSE)
  }
}


#==========

assign(decade,h)
h=as.data.frame(as.list(map))
h=t(h)
print(ls(map))

map[['violin']]
#set up a subset of important genres
genres  <- new.env(hash=T, parent=emptyenv())
genres[['s']]
for (type in ls(map)){
  
}
