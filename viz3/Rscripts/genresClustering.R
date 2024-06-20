read<-
genres<-c('swing','folk','christmas','jazz','blues','dance','country','gospel','boogie',
          'folk')
for(i in 1:ncol(file)){
  for(gen in genres){
    if(file[1,i] == gen){
      file[1,i] <-gen
      break
    }+
  }
}