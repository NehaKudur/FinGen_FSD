const cards=[
"Stocks",
"Crypto",
"Bonds",
"Mutual Funds",
"Gold"
]

const scenarios={

Stocks:{
q:"Market crashes 20%. What do you do?",
good:2
},

Crypto:{
q:"Crypto volatility increases.",
good:1
},

Bonds:{
q:"Interest rates rise.",
good:2
},

Gold:{
q:"Inflation rises.",
good:1
},

"Mutual Funds":{
q:"You start SIP investing.",
good:1
}

}

let score=0
let mistakes=0
let current

document.getElementById("draw").onclick=()=>{

let card=cards[Math.floor(Math.random()*cards.length)]

current=card

showScenario(card)

}

function showScenario(card){

document.getElementById("scenario").classList.remove("hidden")

document.getElementById("question").innerText=scenarios[card].q

}

function answer(option){

let good=scenarios[current].good

if(option===good){
score+=10
}else{
score-=5
mistakes++
}

document.getElementById("score").innerText=score

document.getElementById("scenario").classList.add("hidden")

if(mistakes>5){
endGame()
}

}

function endGame(){

document.getElementById("summary").classList.remove("hidden")

document.getElementById("result").innerText=
`Score ${score} - Your investment decisions were evaluated.`

}

document.getElementById("aiBtn").onclick=()=>{

document.getElementById("ai").innerHTML=
`<p><b>AI Insight:</b> Diversification and long-term investing improve financial stability.</p>`

}