const board=document.getElementById("board")

let position=1
let score=0
let mistakes=0

const snakes={
16:6,
48:30,
79:19
}

const ladders={
3:22,
15:44,
40:65
}

for(let i=1;i<=100;i++){

let cell=document.createElement("div")
cell.className="cell"
cell.id="cell"+i
cell.innerText=i

board.appendChild(cell)

}

updatePlayer()

document.getElementById("rollDice").onclick=()=>{

let dice=Math.floor(Math.random()*6)+1
document.getElementById("dice").innerText=dice

position+=dice

if(position>100) position=100

updatePlayer()

triggerScenario()

}

function updatePlayer(){

document.querySelectorAll(".cell").forEach(c=>c.classList.remove("player"))

let cell=document.getElementById("cell"+position)

if(cell) cell.classList.add("player")

document.getElementById("pos").innerText=position

}

const scenarios=[
{
text:"You receive a bonus. Save it or spend it?",
good:1
},
{
text:"You buy a phone on credit without planning.",
good:2
},
{
text:"You start an emergency fund.",
good:1
}
]

let currentScenario

function triggerScenario(){

currentScenario=scenarios[Math.floor(Math.random()*scenarios.length)]

document.getElementById("scenarioBox").classList.remove("hidden")

document.getElementById("scenarioText").innerText=currentScenario.text

}

function choose(option){

document.getElementById("scenarioBox").classList.add("hidden")

if(option===currentScenario.good){

score+=10

if(ladders[position]){
position=ladders[position]
}

}else{

score-=5
mistakes++

if(snakes[position]){
position=snakes[position]
}

}

updatePlayer()

document.getElementById("score").innerText=score

if(mistakes>5){
endGame("lose")
}

if(position===100){
endGame("win")
}

}

function endGame(type){

document.getElementById("summary").classList.remove("hidden")

let text=""

if(type==="win"){
text=`You reached financial success! Score ${score}`
}
else{
text=`Too many bad decisions. Score ${score}`
}

document.getElementById("result").innerText=text

}

document.getElementById("analyze").onclick=()=>{

document.getElementById("ai").innerHTML=
`<p><b>AI Insight:</b> Based on your decisions you should focus on saving habits and avoiding impulse credit spending.</p>`

}