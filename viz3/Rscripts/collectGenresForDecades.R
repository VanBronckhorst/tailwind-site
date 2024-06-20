library('RCurl')
library('rjson')
#-----------------UTILITY------------------
deUnicodefy<-function(tmpName){
  ts = c("À","Å","Æ","Ç","È","Ë","Ì","Ï","Ð","Ñ","Ò","Ö","Ø","×","Ù","Ü","Ý","ß","à","å","ã","æ","ç","è","é","ë","ì","í","ï","ð","ñ","ò","ó","ô","ö","ø","÷","ù","ü","ý","ÿ");
  tn = c("A","A","AE","C","E","E","I","I","D","N","O","O","O","X","U","U","Y","Y","a","a","a","ae","c","e","e","e","i","i","i","d","n","o","o","o","o","o","x","u","u","y","y");
  for(s in ts){
    tmpName=gsub(s,tn[which(ts==s)], tmpName);
  }
  return (tmpName)
}
#---------------------------------------------KEYS
musicGraphKeys<-c('b9ae99ef9698a8c2531b22073231d4b7','0a48b1b98f9ad443773e990f1e92667e','845963ce1cbd280b928023167064f3ab')
nestKeys = c('CFLBFVAPYPMUYTTSR','QVJX27LZP1Q9GYBYV','45PFVVAQZQJD5BIV5','PKT63BEXLXWEDVVKE','ZTFPNPKXWOQAHAG2G')
#=========================set global vars
excluded = list() #keep track of those excluded for anyreason
errorDecades = list()#keep track of errors during musicgraph calls

limit = '100' #limit call for musicGraph
decade<-1970
total<-0 #number of total artist searched
while(decade<=2010){
  print(decade)
  map <- new.env(hash=T, parent=emptyenv())#set hashmap of genres 
  offset = 1
  #=====while there is data, or if it's just the first call
  while(offset==1 || obj$pagination$count >= as.numeric(limit)){
    print(offset)
    #==============================collect decade artists' name
    apiK = musicGraphKeys[1]
    musicGraphKeys=append(musicGraphKeys[-1],musicGraphKeys[1]) #rotate keys
    
    baseLink = 'http://api.musicgraph.com/api/v2/artist/search?api_key='
    link<-paste(baseLink,apiK,'&decade=',decade,'s','&limit=', limit,'&offset=',offset, sep = "")
    json <- getURL(link)
    obj <- suppressWarnings(fromJSON(json,unexpected.escape = "keep"))

    namesId = list() #names of artist of the current slice of the decade
    if(obj$status$code == 0){
      for(i in 1:length(obj$data)){
        namesId=append(namesId,obj$data[[i]]$name)
      }
    }else{
      errorDecades=append(errorDecades,link)
    }
    total = total + length(namesId)
    
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
      if(objNest$response$status$code==0 && 
         length(objNest$response$artists)>0 &&
         length(objNest$response$artists[[1]]$genres) > 0){
        for(i in 1:length(objNest$response$artists[[1]]$genres)){
          genreName<- objNest$response$artists[[1]]$genres[[i]]$name
          if(is.null(map[[genreName]])){
            map[[genreName]] = 1
          }else{
            map[[genreName]] = map[[genreName]]+1
          }
          
        }
      }else{
        excluded=append(excluded,name)
      }
    }
    
    offset = offset+100
  }
  assign(as.character(decade),as.data.frame(as.list(map)))
  write.table(as.data.frame(as.list(map)), file = paste(as.name(decade),".csv",sep=''),sep=",",row.names=FALSE)
  decade =decade + 10
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
