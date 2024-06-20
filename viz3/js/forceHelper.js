function existingBelongs(artist , existingGenresNodes) {
  var belongingGenres = [];
  for(i=0; i < artist.genres.length; i++) {
    for(j=0; j < existingGenresNodes.length; j++) {
      if(existingGenresNodes.type == "genre") {
        if(artist.genres[i].name == existingGenresNodes[j].name) {
          belongingGenres.push(existingGenresNodes[i]);
        }
      }
    }
  }
  return belongingGenres;
}

function belongs(artist , genre) {
  for(i=0; i < artist.genres.length; i++) {
    if(artist.genres[i].name == genre) {
      return true;
    }
  }
  return false;
}

function similarGenres(genre1, genre2) {
  return stringIntersection(genre1, genre2).length > 2;
}

function stringIntersection(str1, str2) {
    var strTemp;

    // Swap parameters if necessary to ensure str1 is the shorter
    if (str1.length > str2.length) {
        strTemp = str1;
        str1 = str2;
        str2 = strTemp;
    }

    // Start with the whole of str1 and try shorter substrings until
    // we have a common one
    var str1Len = str1.length, l = str1Len, start, substring;
    while (l > 0) {
        start = str1Len - l;
        while (start >= 0) {
            substring = str1.slice(start, l);
            if (str2.indexOf(substring) > -1) {
                return substring;
            }
            start--;
        }
        l--;
    }
    return "";
}


function stringIntersection2(str1, str2) {
    var splitStr1 = str1.split(" ");
    var splitStr2 = str2.split(" ");
    var equals = [];
    var minLength = 1000;
    var minEqual = "";

    for (i1 in splitStr1) {
      for (i2 in splitStr2) {
        if(i1 == i2) {
          equals.push(splitStr1[i1]);
        }
      }
    }

    for(i in equals) {
      if(equals[i].length < minLength) {
        minEqual = equals[i];
        minLength = equals[i].length;
      }
    }

    return minEqual;
}
