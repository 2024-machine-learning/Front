function postData(title, content) {
    console.log('Post Data 실행됨');
    fetch('http://localhost:8080/ai/song', {
      method: 'POST',
      body: JSON.stringify({ novelTitle: title, novelContent: content }),
    })
    .then(()=>{
        loadPage('../../resultPage.html',[]);
    })
    .then(response => response.json())
    .then(data => {
      if (data.tracks.items.length > 0) {
        document.getElementById('titleText').innerHTML = data.novelTitle;
        document.getElementById('novelContent').innerHTML = data.novelContent;
        document.getElementById('AlbumArt').setAttribute('src',data.tracks.items[0].album.images[0].url)
        return data.tracks.items[0].id;
      } else {
        document.getElementById('titleText').innerHTML = data.novelTitle;
        document.getElementById('novelContent').innerHTML = data.novelContent;
      }
    })
    .catch(err => {
        console.error(err);
        console.log(title);
        console.log(content);
        loadPage('../../resultPage.html',['https://sdk.scdn.co/spotify-player.js','./static/script/apiScript.js'],()=>{
            const titleText = document.getElementById('titleText');
            const novelContent = document.getElementById('novelContent');

            if (titleText && novelContent) {
                titleText.innerHTML = title;
                novelContent.innerHTML = content;
            } 
        });
        
    });
  }