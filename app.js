const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],key=()=>new Date().toISOString().slice(0,10),id=()=>Math.random().toString(36).slice(2,10),read=(k,d)=>{try{return JSON.parse(localStorage.getItem("lifeos_"+k))??d}catch{return d}},write=()=>{["tasks","habits","goals","transactions","journals"].forEach(k=>localStorage.setItem("lifeos_"+k,JSON.stringify(data[k])))},esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),money=n=>"₹"+Number(n||0).toLocaleString("en-IN"),fmt=d=>d?new Date(d+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short"}):"No date";
let data={tasks:read("tasks",[{id:id(),title:"Review Java OOP concepts",date:key(),priority:"High",done:false},{id:id(),title:"Practice DSA for 30 minutes",date:key(),priority:"Medium",done:false},{id:id(),title:"Read 10 pages",date:key(),priority:"Low",done:true}]),habits:read("habits",[{id:id(),name:"Morning workout",emoji:"🏃",days:{}},{id:id(),name:"Read for 20 minutes",emoji:"📚",days:{}},{id:id(),name:"Drink 2L water",emoji:"💧",days:{}},{id:id(),name:"Practice coding",emoji:"💻",days:{}}]),goals:read("goals",[{id:id(),title:"Master Java",description:"Build a strong foundation in Java.",progress:35,due:"2026-12-31"},{id:id(),title:"Build a portfolio",description:"Publish three useful projects.",progress:60,due:"2027-01-15"}]),transactions:read("transactions",[{id:id(),title:"Monthly allowance",amount:5000,type:"income",date:key(),category:"Income"},{id:id(),title:"Books and stationery",amount:650,type:"expense",date:key(),category:"Education"}]),journals:read("journals",[])};
let filter="all",timer=1500,interval=null,chart=null,kind="";
function toast(s){$("#toast").textContent=s;$("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),2200)}
function days7(){return Array.from({length:7},(_,i)=>{let d=new Date();d.setDate(d.getDate()-6+i);return{key:d.toISOString().slice(0,10),label:d.toLocaleDateString("en",{weekday:"short"}).slice(0,2)}})}
function streak(h){let n=0,d=new Date();while(h.days[d.toISOString().slice(0,10)]){n++;d.setDate(d.getDate()-1)}return n}
function taskRow(t,actions=false){return `<div class="task"><button class="check ${t.done?"done":""}" data-task="${t.id}">${t.done?"✓":""}</button><div class="taskname ${t.done?"done":""}">${esc(t.title)}<small class="sub">${fmt(t.date)} · ${t.priority} priority</small></div><span class="badge ${t.priority}">${t.priority}</span>${actions?`<button class="link" data-edit="${t.id}">Edit</button><button class="link" data-del-task="${t.id}">×</button>`:""}</div>`}
function render(){
let done=data.tasks.filter(t=>t.done).length,pct=data.tasks.length?Math.round(done/data.tasks.length*100):0,hd=data.habits.filter(h=>h.days[key()]).length,hp=data.habits.length?Math.round(hd/data.habits.length*100):0,active=data.goals.filter(g=>g.progress<100).length,inc=data.transactions.filter(t=>t.type==="income").reduce((a,t)=>a+ +t.amount,0),exp=data.transactions.filter(t=>t.type==="expense").reduce((a,t)=>a+ +t.amount,0);
$("#doneStat").textContent=done;$("#taskPct").textContent=pct+"% of your tasks";$("#taskBar").style.width=pct+"%";$("#habitPct").textContent=hp+"%";$("#habitBar").style.width=hp+"%";$("#goalStat").textContent=active;$("#goalBar").style.width=(data.goals.length?data.goals.reduce((a,g)=>a+ +g.progress,0)/data.goals.length:0)+"%";$("#balanceStat").textContent=money(inc-exp);$("#moneyBar").style.width=Math.max(0,Math.min(100,inc?(inc-exp)/inc*100:0))+"%";
$("#todayTasks").innerHTML=data.tasks.filter(t=>t.date===key()).slice(0,5).map(t=>taskRow(t)).join("")||'<p class="sub">Nothing planned for today. Add a task to get started.</p>';
$("#taskList").innerHTML=data.tasks.filter(t=>filter==="all"||(filter==="active"&&!t.done)||(filter==="done"&&t.done)).filter(t=>t.title.toLowerCase().includes(($("#search")?.value||"").toLowerCase())).map(t=>taskRow(t,true)).join("")||'<div class="empty">No tasks found.</div>';
$("#homeHabits").innerHTML=data.habits.slice(0,5).map(h=>`<div class="habitline"><span class="emoji">${h.emoji}</span><span>${esc(h.name)}</span><button class="habitcheck ${h.days[key()]?"done":""}" data-habit="${h.id}">${h.days[key()]?"✓":"＋"}</button></div>`).join("")||'<p class="sub">Add your first habit.</p>';
$("#habitSummary").innerHTML=[[""+hp+"%","Today's completion"],[hd+"/"+data.habits.length,"Habits completed"],[data.habits.length,"Active habits"]].map(x=>`<div class="box"><strong>${x[0]}</strong><small>${x[1]}</small></div>`).join("");
$("#habitCards").innerHTML=data.habits.map(h=>`<article class="mini-card"><div class="emoji">${h.emoji}</div><h3>${esc(h.name)}</h3><p>✦ ${streak(h)} day current streak</p><button class="primary" data-habit="${h.id}">${h.days[key()]?"✓ Completed today":"Mark complete"}</button><div class="sub" style="margin-top:13px">${days7().map(d=>`${h.days[d.key]?"🟢":"⚪"} ${d.label}`).join("　")}</div><button class="link" data-del-habit="${h.id}">Remove habit</button></article>`).join("")||'<div class="empty">No habits yet.</div>';
$("#goalCards").innerHTML=data.goals.map(g=>`<article class="mini-card"><div class="emoji">🎯</div><h3>${esc(g.title)}</h3><p>${esc(g.description)}</p><div class="progress"><i style="width:${Math.min(100,g.progress)}%"></i></div><div class="meta"><span>${g.progress}% complete</span><span>Due ${fmt(g.due)}</span></div><div style="margin-top:14px"><button class="secondary" data-goal="${g.id}">＋ 10%</button> <button class="link" data-del-goal="${g.id}">Delete</button></div></article>`).join("")||'<div class="empty">Create your first goal.</div>';
$("#financeStats").innerHTML=[["Total income",money(inc)],["Total expenses",money(exp)],["Balance",money(inc-exp)]].map(x=>`<div class="box"><small>${x[0]}</small><strong>${x[1]}</strong></div>`).join("");
$("#transactions").innerHTML=data.transactions.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(t=>`<div class="transaction"><span class="emoji">${t.type==="income"?"↙":"↗"}</span><span class="grow"><b>${esc(t.title)}</b><small class="sub">${esc(t.category)} · ${fmt(t.date)}</small></span><b class="${t.type}">${t.type==="income"?"+":"−"}${money(t.amount)}</b><button class="link" data-del-tx="${t.id}">×</button></div>`).join("")||'<p class="sub">No transactions yet.</p>';
$("#entries").innerHTML=data.journals.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(j=>`<article class="entry"><small>${fmt(j.date)} · ${j.mood}</small><p>${esc(j.text)}</p><button class="link" data-del-entry="${j.id}">Delete</button></article>`).join("")||'<p class="sub">Your journal entries will appear here.</p>';
if(window.Chart){let c=$("#chart");if(chart)chart.destroy();chart=new Chart(c,{type:"bar",data:{labels:days7().map(d=>d.label),datasets:[{data:days7().map(d=>data.tasks.filter(t=>t.done&&t.date===d.key).length),backgroundColor:"#8d7af0",borderRadius:6,maxBarThickness:24}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{beginAtZero:true,ticks:{stepSize:1}}}}})}
}
function page(p){$$(".page").forEach(x=>x.classList.toggle("active",x.id===p));$$("nav button").forEach(x=>x.classList.toggle("active",x.dataset.page===p));$("#crumb").textContent=p==="home"?"Overview":p[0].toUpperCase()+p.slice(1);$(".side").classList.remove("open");render()}
function openForm(k){kind=k;let forms={task:["New task",'<div class="field"><label>Task name</label><input name="title" required placeholder="Finish assignment"></div><div class="field"><label>Due date</label><input name="date" type="date" value="'+key()+'"></div><div class="field"><label>Priority</label><select name="priority"><option>Low</option><option selected>Medium</option><option>High</option></select></div>'],habit:["New habit",'<div class="field"><label>Habit name</label><input name="name" required placeholder="Meditate for 10 minutes"></div><div class="field"><label>Emoji</label><select name="emoji"><option>🌱</option><option>🏃</option><option>📚</option><option>💧</option><option>💻</option><option>🧘</option><option>🎨</option></select></div>'],goal:["New goal",'<div class="field"><label>Goal title</label><input name="title" required></div><div class="field"><label>Description</label><textarea name="description"></textarea></div><div class="field"><label>Target date</label><input name="due" type="date"></div><div class="field"><label>Progress %</label><input name="progress" type="number" min="0" max="100" value="0"></div>'],transaction:["New transaction",'<div class="field"><label>Description</label><input name="title" required></div><div class="field"><label>Amount (₹)</label><input name="amount" type="number" min="1" required></div><div class="field"><label>Type</label><select name="type"><option value="expense">Expense</option><option value="income">Income</option></select></div><div class="field"><label>Category</label><select name="category"><option>Food</option><option>Education</option><option>Travel</option><option>Shopping</option><option>Income</option><option>Other</option></select></div><div class="field"><label>Date</label><input name="date" type="date" value="'+key()+'"></div>']};$("#modalTitle").textContent=forms[k][0];$("#fields").innerHTML=forms[k][1];$("#shade").classList.add("show")}
function close(){ $("#shade").classList.remove("show");$("#form").reset()}
$$("nav button").forEach(b=>b.onclick=()=>page(b.dataset.page));$$("[data-jump]").forEach(b=>b.onclick=()=>page(b.dataset.jump));$$("[data-add]").forEach(b=>b.onclick=()=>openForm(b.dataset.add));$("#quick").onclick=()=>openForm("task");$("#close").onclick=$("#cancel").onclick=close;$("#shade").onclick=e=>{if(e.target.id==="shade")close()};
$("#form").onsubmit=e=>{e.preventDefault();let d=Object.fromEntries(new FormData(e.target));if(kind==="task")data.tasks.unshift({id:id(),...d,done:false});if(kind==="habit")data.habits.push({id:id(),...d,days:{}});if(kind==="goal")data.goals.push({id:id(),...d,progress:Math.min(100,Math.max(0,+d.progress||0))});if(kind==="transaction")data.transactions.unshift({id:id(),...d,amount:+d.amount});write();close();render();timerDraw();toast("Saved successfully ✦")};
document.addEventListener("click",e=>{let x=e.target.closest("[data-task],[data-habit],[data-goal],[data-del-task],[data-del-habit],[data-del-goal],[data-del-tx],[data-del-entry],[data-edit]");if(!x)return;if(x.dataset.task){let t=data.tasks.find(t=>t.id===x.dataset.task);t.done=!t.done}if(x.dataset.habit){let h=data.habits.find(h=>h.id===x.dataset.habit);h.days[key()]?delete h.days[key()]:h.days[key()]=true}if(x.dataset.goal){let g=data.goals.find(g=>g.id===x.dataset.goal);g.progress=Math.min(100,+g.progress+10)}if(x.dataset.delTask)data.tasks=data.tasks.filter(t=>t.id!==x.dataset.delTask);if(x.dataset.delHabit)data.habits=data.habits.filter(h=>h.id!==x.dataset.delHabit);if(x.dataset.delGoal)data.goals=data.goals.filter(g=>g.id!==x.dataset.delGoal);if(x.dataset.delTx)data.transactions=data.transactions.filter(t=>t.id!==x.dataset.delTx);if(x.dataset.delEntry)data.journals=data.journals.filter(j=>j.id!==x.dataset.delEntry);if(x.dataset.edit){let t=data.tasks.find(t=>t.id===x.dataset.edit),v=prompt("Edit task title",t.title);if(v?.trim())t.title=v.trim()}write();render()});
$("#filters").onclick=e=>{if(e.target.dataset.filter){filter=e.target.dataset.filter;$$("[data-filter]").forEach(b=>b.classList.toggle("chosen",b===e.target));render()}};$("#search").oninput=render;
$("#saveJournal").onclick=()=>{let text=$("#journalText").value.trim();if(!text)return toast("Write a few words first");data.journals.unshift({id:id(),text,mood:$("#mood").value,date:key()});$("#journalText").value="";write();render();toast("Journal saved ✦")};
$("#theme").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("lifeos_dark",document.body.classList.contains("dark"));timerDraw()};if(localStorage.getItem("lifeos_dark")==="true")document.body.classList.add("dark");$("#menu").onclick=()=>$(".side").classList.toggle("open");
function timerDraw(){let m=String(Math.floor(timer/60)).padStart(2,"0"),s=String(timer%60).padStart(2,"0");$("#clock").textContent=m+":"+s;let total=+$("[data-min].chosen")?.dataset.min||25;let deg=Math.max(0,Math.min(360,((total*60-timer)/(total*60))*360));$(".timer").style.background=`conic-gradient(var(--purple) ${deg}deg,#d9d2ff ${deg}deg)`;if(document.body.classList.contains("dark"))$(".timer").style.background=`conic-gradient(#9b87ff ${deg}deg,#3b3559 ${deg}deg)`}function setTimer(n){clearInterval(interval);interval=null;timer=n*60;timerDraw();$("#start").textContent="Start focus";$$("[data-min]").forEach(b=>b.classList.toggle("chosen",+b.dataset.min===n))}
$("#start").onclick=()=>{if(interval){clearInterval(interval);interval=null;$("#start").textContent="Resume";return}$("#start").textContent="Pause";interval=setInterval(()=>{timer--;timerDraw();if(timer<=0){clearInterval(interval);interval=null;$("#start").textContent="Start focus";toast("Focus session complete! 🎉")}},1000)};$("#reset").onclick=()=>setTimer(+$("[data-min].chosen").dataset.min);$$("[data-min]").forEach(b=>b.onclick=()=>setTimer(+b.dataset.min));
$("#date").textContent=new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"});$("#day").textContent=new Date().toLocaleDateString("en-IN",{weekday:"long"});$("#fulldate").textContent=new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});render();

// Local demo authentication. This is a browser-only UI, not production security.
let authMode = "signin";
const authUsersKey = "lifeos_demo_users";
const authSessionKey = "lifeos_demo_session";
function getUsers(){try{return JSON.parse(localStorage.getItem(authUsersKey))||[]}catch{return []}}
function setAuthMode(mode){
  authMode=mode;
  $("#authHeading").textContent=mode==="signup"?"Create your account.":"Welcome back.";
  $("#authSub").textContent=mode==="signup"?"Set up your personal LifeOS workspace.":"Sign in to continue to your LifeOS dashboard.";
  $("#nameField").hidden=mode!=="signup";
  $("#authName").required=mode==="signup";
  $("#authPassword").autocomplete=mode==="signup"?"new-password":"current-password";
  $("#authSubmit").textContent=mode==="signup"?"Create account":"Sign in";
  $("#authSwitchText").textContent=mode==="signup"?"Already have an account?":"New to LifeOS?";
  $("#authSwitch").textContent=mode==="signup"?"Sign in":"Create an account";
  $("#authError").textContent="";
}
function showAppForSession(){
  const session=localStorage.getItem(authSessionKey);
  $("#authScreen").hidden=!!session;
  const user=session ? getUsers().find(x=>x.email===session) : null;
  const name=user?.name?.trim() || "Your account";
  $("#accountName").textContent=name;
  $("#accountEmail").textContent=user?.email || "Not signed in";
  $("#accountAvatar").textContent=(name[0]||"U").toUpperCase();
  $("#welcomeHeading").innerHTML=user
    ? `Welcome, ${esc(name.split(" ")[0])}. <em>Make today count.</em>`
    : 'Make today <em>count.</em>';
  $("#signOut").hidden=!session;
  $("#resetData").hidden=!session;
}
$("#authSwitch").addEventListener("click",()=>setAuthMode(authMode==="signin"?"signup":"signin"));
$("#authForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("#authName").value.trim(),email=$("#authEmail").value.trim().toLowerCase(),password=$("#authPassword").value;
  let users=getUsers();
  if(authMode==="signup"){
    if(users.some(u=>u.email===email)){ $("#authError").textContent="An account with this email already exists.";return; }
    users.push({name,email,password});
    localStorage.setItem(authUsersKey,JSON.stringify(users));
    localStorage.setItem(authSessionKey,email);
    toast("Account created. Welcome to LifeOS!");
  }else{
    const user=users.find(u=>u.email===email&&u.password===password);
    if(!user){$("#authError").textContent="Email or password is incorrect. Create an account if this is your first visit.";return;}
    localStorage.setItem(authSessionKey,email);
    toast("Signed in successfully.");
  }
  showAppForSession();
});
$("#signOut").addEventListener("click",()=>{
  if(confirm("Sign out of LifeOS?")){localStorage.removeItem(authSessionKey);showAppForSession();setAuthMode("signin");}
});
$("#resetData").addEventListener("click",()=>{
  if(!confirm("Reset ALL LifeOS workspace data? This will permanently clear every task, habit, goal, transaction, and journal entry. All dashboard totals will become zero. Your sign-in account and theme preference will remain.")) return;

  // Empty arrays are deliberately saved (not removed), so starter demo records
  // are not re-created by the default values when the page reloads.
  data.tasks = [];
  data.habits = [];
  data.goals = [];
  data.transactions = [];
  data.journals = [];
  write();

  // Reset transient UI state as well.
  filter = "all";
  if ($("#search")) $("#search").value = "";
  if ($("#journalText")) $("#journalText").value = "";
  if (interval) { clearInterval(interval); interval = null; }
  setTimer(25);

  render();
  toast("All LifeOS data has been reset. Every total is now zero.");
});
showAppForSession();
