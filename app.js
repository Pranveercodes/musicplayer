let plays = document.querySelectorAll(".desk");
let playsong= document.querySelector(".song");
let lists= document.querySelector(".songlist");
let time = document.querySelector(".bar");
let songs;
function sectomin(seconds){
  if(isNaN(seconds) || seconds<0){
    return "invalid input";
  }

  const minutes = Math.floor(seconds/60);
  const remainingSeconds = Math.floor(seconds%60);
  return `${minutes}:${ remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};


let currsong= new Audio();
 const playmusic = (track, pause=false)=>{
  
   currsong.src = "/songs/" + track;
   if(!pause){
     currsong.play();
     play.src="pause.svg";

   }
  document.querySelector(".songinfo").innerHTML=track;
    document.querySelector(".songtime").innerHTML="00:00";
    
 }

async function fetchsong() {

    let song= await fetch("http://127.0.0.1:5500/songs/")
    let name = await song.text();
     let div = document.createElement("div");
    div.innerHTML= name;
    let list = div.getElementsByTagName("a");
    let songs=[];
  for (let val of list){
  
    if(val.href.endsWith(".mpeg")){
        songs.push(val.href.split("/songs/")[1].replaceAll("%20", " ").trim());
    }
  }
    return songs;
};


 async function main(){
  
     songs =  await fetchsong();
    playmusic(songs[0],true);
     console.log(songs);
  let songul = lists.getElementsByTagName("ul")[0];
  for (const song of songs){
    songul.innerHTML=songul.innerHTML+ ` <li>  
     <img class="music" src="music.svg">
            <div class="border">
                <div>${song}</div>
            </div>


            <div class="track">
                <img src="play.svg">
            </div>
            </li>`;
  }

   Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
      // console.log(e.querySelector(".border")?.firstElementChild.innerHTML.trim())
    
  playmusic(e.querySelector(".border")?.firstElementChild.innerHTML);
    })
     
     
    })
play.addEventListener("click",()=>{
  if(currsong.paused){
    currsong.play();
    play.src="pause.svg";
    
  
  }
  else{
    currsong.pause();
    play.src="play.svg";
  }
})    

   currsong.addEventListener("timeupdate",(e)=>{
  document.querySelector(".songtime").innerHTML=`${sectomin(currsong.currentTime)}/${sectomin(currsong.duration)}`
  time.style.left=(currsong.currentTime/currsong.duration)*100 + "%";
  


});
document.querySelector(".seekbar").addEventListener("click", (e)=>{
  let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
// console.log(percent);
  document.querySelector(".bar").style.left = percent + "%";
  currsong.currentTime=((currsong.duration)*percent)/100;
 
  
})

currsong.addEventListener("ended",()=>{

  let index = songs.indexOf(currsong.src.replaceAll("%20", " ").split("/").slice(-1)[0])
  if((index+1)<songs.length){
    playmusic(songs[index+1])
  }
  else{
     index=0;
      playmusic(songs[index]);
  
  };
})


left.addEventListener("click",()=>{
 
   console.log("previous clicked");

let index= songs.indexOf(currsong.src.replaceAll("%20", " ").split("/").slice(-1)[0]) 

if((index-1)>=0){
  playmusic(songs[index-1])
}
                     
   
});

right.addEventListener("click",()=>{
  
  let index= songs.indexOf(currsong.src.replaceAll("%20", " ").split("/").slice(-1)[0]) 
     if((index+1)<songs.length){
      playmusic(songs[index+1])
   
    }
});
  }
   
      
 
main();

