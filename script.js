// ================= CLOCK + GREETING =================
function startClock(){
function update(){
let now=new Date();
let hour=now.getHours();

let greet=hour<12?"🌤 Good Morning!":hour<18?"☀ Good Afternoon!":"🌙 Good Evening!";

if(document.getElementById("greetingText"))
document.getElementById("greetingText").innerText=greet;

if(document.getElementById("clock"))
document.getElementById("clock").innerText=now.toLocaleTimeString();
}
update();
setInterval(update,1000);
}

// ================= ROUTINE (BUTTON BASED) =================
function markDone(task, btn){

btn.classList.add("done");

localStorage.setItem(task,"done");

fetch("http://localhost:5000/save-routine", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
task: task,
time: new Date()
})
})
.then(res => res.text())
.then(data => console.log("Saved:", data))
.catch(err => console.log(err));
}

window.addEventListener("load",()=>{

let today = new Date().toDateString();
let savedDate = localStorage.getItem("date");

if(savedDate !== today){
["wake","breakfast","lunch","dinner"].forEach(task=>{
localStorage.removeItem(task);
});
localStorage.setItem("date", today);
}

["wake","breakfast","lunch","dinner"].forEach(task=>{
if(localStorage.getItem(task)==="done"){
let btn=document.getElementById(task);
if(btn) btn.classList.add("done");
}
});

});

// ================= MEDICINE =================
function saveMedicine(){
let med={
name:document.getElementById("medName").value,
time:document.getElementById("medTime").value
};

localStorage.setItem("medicine",JSON.stringify(med));
alert("Medicine Saved");
analyzeHealth();
}

// ================= WATER =================
function saveWater(){
let water=document.getElementById("water").value;
localStorage.setItem("water",water);
alert("Water Saved");
}

// ================= MOOD =================
function saveMood(){
let mood=document.getElementById("moodSelect").value;
localStorage.setItem("mood",mood);
alert("Mood Saved");
analyzeHealth();
}

// ================= SOS =================
function sendSOS(){
alert("🚨 Emergency Alert Sent!");

if(document.getElementById("sosStatus")){
document.getElementById("sosStatus").innerText = "Emergency Alert Sent to Caregiver!";
}
}

// ================= NOTIFICATIONS =================
function showNotifications(){

let med=JSON.parse(localStorage.getItem("medicine"));

let msg="No new notifications";

if(med){
msg="Reminder: Take "+med.name+" at "+med.time;
}

alert(msg);
}

// ================= ANALYZE HEALTH =================
function analyzeHealth(){

let alerts=[];
let suggestion="All good today 👍";

let tasks=["wake","breakfast","lunch","dinner"];
let done=tasks.filter(t=>localStorage.getItem(t)==="done").length;

if(done<2){
alerts.push("Low Activity");
suggestion="Try completing your daily routine.";
if(document.getElementById("routineScore"))
document.getElementById("routineScore").innerText="Routine: Low";
}else{
if(document.getElementById("routineScore"))
document.getElementById("routineScore").innerText="Routine: Good";
}

let med=JSON.parse(localStorage.getItem("medicine"));

if(med){
let now=new Date().toTimeString().slice(0,5);

if(now>med.time){
alerts.push("Medicine Missed");
suggestion="Take your medicine now!";
if(document.getElementById("medicineStatus"))
document.getElementById("medicineStatus").innerText="Medicine: Missed";
}else{
if(document.getElementById("medicineStatus"))
document.getElementById("medicineStatus").innerText="Medicine: On Time";
}
}

let mood=localStorage.getItem("mood");

if(mood==="Low"){
alerts.push("Low Mood");
suggestion="Talk to someone 😊";
if(document.getElementById("moodStatusCard"))
document.getElementById("moodStatusCard").innerText="Mood: Low";
}else{
if(document.getElementById("moodStatusCard"))
document.getElementById("moodStatusCard").innerText="Mood: Stable";
}

let panel=document.getElementById("healthAlert");

if(panel){
if(alerts.length===0){
panel.innerText="All Normal";
panel.style.color="green";
}else{
panel.innerText=alerts.join(",");
panel.style.color="red";
}
}

let ai=document.getElementById("aiSuggestion");
if(ai) ai.innerText=suggestion;
}

let tasks=["wake","breakfast","lunch","dinner"];
let doneTasks=tasks.filter(t=>localStorage.getItem(t)==="done").length;

if(document.getElementById("routineCount")){
document.getElementById("routineCount").innerText =
"Completed: "+doneTasks+" / 4 tasks";
}

// ================= WEEKLY REPORT =================
function generateWeeklyReport(){

let water=localStorage.getItem("water")||0;
let mood=localStorage.getItem("mood")||"Stable";

let report=
"Water: "+water+" glasses\nMood: "+mood;

let panel=document.getElementById("weeklyReport");

if(panel) panel.innerText=report;
}

// ================= AI CHAT =================
function sendMessage(){

let input=document.getElementById("userInput");
let msg=input.value;

if(msg==="") return;

addMessage(msg,"user");

let reply=generateSmartReply(msg);

setTimeout(()=>{
addMessage(reply,"bot");
},500);

input.value="";
}

function addMessage(text,type){

let chatbox=document.getElementById("chatbox");
if(!chatbox) return;

let msg=document.createElement("div");
msg.classList.add("message",type);
msg.innerText=text;

chatbox.appendChild(msg);
chatbox.scrollTop=chatbox.scrollHeight;
}

// ================= SMART AI =================
function generateSmartReply(userMsg){

userMsg=userMsg.toLowerCase();

let water=localStorage.getItem("water") || 0;
let mood=localStorage.getItem("mood") || "unknown";
let med=JSON.parse(localStorage.getItem("medicine"));

if(userMsg.includes("medicine")){
if(med){
return "Take "+med.name+" at "+med.time+" 💊";
}else{
return "No medicine scheduled.";
}
}

if(userMsg.includes("water")){
return water<5 ? "Drink more water 💧" : "Good hydration 👍";
}

if(userMsg.includes("lonely")){
return "I'm here with you 😊";
}

// ✅ ONLY THIS LINE UPDATED
return "Based on your data:\n" + generateGeneralAdvice(water,mood,0,med);
}

// ================= PROFILE SAVE =================
async function saveProfile(){

let name=document.getElementById("name").value;
let age=document.getElementById("age").value;
let blood=document.getElementById("blood").value;
let condition=document.getElementById("condition").value;
let contact=document.getElementById("contact").value;

if(!name || !age){
alert("Fill required fields");
return;
}

try{

let res=await fetch("http://localhost:5000/save-profile",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({name,age,blood,condition,contact})
});

let result=await res.text();
alert(result);

}catch(err){
console.log(err);
alert("Error saving profile");
}
}

// ================= PROFILE LOAD =================
async function loadProfile(){

try{

let res = await fetch("http://localhost:5000/get-profile");
let data = await res.json();

if(data && document.getElementById("profileName")){

document.getElementById("profileName").innerText = data.name || "-";
document.getElementById("profileAge").innerText = data.age || "-";

}

}catch(err){
console.log("Error loading profile", err);
}
}

// ================= AUTO RUN =================
window.onload=function(){
startClock();
analyzeHealth();
generateWeeklyReport();
loadProfile();

// 🔥 NEW REAL-TIME UPDATE
setInterval(()=>{
analyzeHealth();
generateWeeklyReport();
},5000);
};
// ================= FIX: GENERAL ADVICE FUNCTION =================
function generateGeneralAdvice(water, mood, doneTasks, med){

let advice = "";

// WATER
if(water < 5){
advice += "💧 Drink more water\n";
}

// ROUTINE
if(doneTasks < 2){
advice += "⚠ Complete your daily tasks\n";
}

// MOOD
if(mood === "Low"){
advice += "😊 Talk to someone\n";
}

// MEDICINE
if(med){
advice += "💊 Take " + med.name + " at " + med.time + "\n";
}

// DEFAULT
if(advice === ""){
advice = "You're doing great today 🌸";
}

return advice;
}
// ================= FIX: QUICK MESSAGE BUTTONS =================
function quickMessage(text){

let input = document.getElementById("userInput");

if(!input){
console.log("Input box not found ❌");
return;
}

input.value = text;

// direct send
sendMessage();
}