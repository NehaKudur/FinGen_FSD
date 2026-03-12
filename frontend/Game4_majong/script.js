const pairs = [

["Savings","Money set aside for future"],
["Debt","Money you owe"],
["Investment","Money used to generate profit"],
["Emergency Fund","Savings for unexpected events"]

]

let tiles = []
pairs.forEach(pair=>{
tiles.push(pair[0])
tiles.push(pair[1])
})

tiles = tiles.sort(()=>Math.random()-0.5)

const board = document.getElementById("gameBoard")

let firstTile=null
let secondTile=null
let lock=false

let matches=0
let mistakes=0

tiles.forEach(text=>{

let tile=document.createElement("div")
tile.classList.add("tile")
tile.dataset.value=text
tile.innerText="?"

tile.addEventListener("click",()=>reveal(tile))

board.appendChild(tile)

})

function reveal(tile){

if(lock || tile.classList.contains("revealed")) return

tile.classList.add("revealed")
tile.innerText=tile.dataset.value

if(!firstTile){
firstTile=tile
return
}

secondTile=tile
lock=true

checkMatch()

}

function checkMatch(){

const pair=pairs.find(p=>p.includes(firstTile.dataset.value) && p.includes(secondTile.dataset.value))

if(pair){

matches++
document.getElementById("matches").innerText=matches

resetTurn()

}else{

mistakes++
document.getElementById("mistakes").innerText=mistakes

setTimeout(()=>{

firstTile.classList.remove("revealed")
secondTile.classList.remove("revealed")

firstTile.innerText="?"
secondTile.innerText="?"

resetTurn()

},900)

}

}

function resetTurn(){
firstTile=null
secondTile=null
lock=false
}

document.getElementById("finishBtn").onclick=()=>{

document.getElementById("summary").classList.remove("hidden")

let result=`You made ${matches} correct matches and ${mistakes} mistakes.`

document.getElementById("resultText").innerText=result

}

document.getElementById("analyzeBtn").onclick=async()=>{

const summary=`Matches:${matches}, Mistakes:${mistakes}. 
User understanding of financial concepts based on this.`

/*
INSERT YOUR AI API HERE
Example:
fetch("/api/analyze",{
method:"POST",
body:JSON.stringify({summary})
})
*/

document.getElementById("aiResult").innerHTML=

`<p><b>AI Financial Insight:</b></p>
<p>Your understanding of financial basics is moderate. Focus on strengthening concepts like savings and emergency funds to improve financial stability.</p>`

}