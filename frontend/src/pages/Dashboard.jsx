import { useState, useEffect, useRef } from "react";
import TaskCard from "../components/TaskCard";
import API from "../api.js";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";
function Dashboard(){
const [task,setTask] = useState("");
const [tasks,setTasks] = useState([]);
const [search,setSearch] = useState("");
const [sortOption,setSortOption] = useState("default");
const [categorySort,setCategorySort] = useState("");
const [dueDate,setDueDate] = useState("");
const [category,setCategory] = useState("");
const [repeat,setRepeat] = useState("Daily");
const [editId,setEditId] = useState(null);
const [editText,setEditText] = useState("");
const [editDate,setEditDate] = useState("");
const [editCategory,setEditCategory] = useState("");
const [editRepeat,setEditRepeat] = useState("Daily");
const [message,setMessage] = useState("");
const [newTaskId,setNewTaskId] = useState(null);
const [deleteConfirmId,setDeleteConfirmId] = useState(null);
const newTaskRef = useRef(null);
const sensors = useSensors(
useSensor(PointerSensor,{
activationConstraint:{
distance:8
}
})
);
const user = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const [loginType, setLoginType] = useState(
  localStorage.getItem("loginType")
);
useEffect(() => {

  fetchTasks();

  if (loginType) {

    const timer = setTimeout(() => {

      localStorage.removeItem("loginType");
      setLoginType(null);

    }, 3000);

    return () => clearTimeout(timer);

  }

}, [loginType]);
async function fetchTasks(){
try{
const res = await API.get("/tasks");
setTasks(res.data);
}catch(err){
console.log(err);
}
}
function showMessage(text){
setMessage(text);
setTimeout(()=>{
setMessage("");
},2500);
}
async function addTask(){
if(task.trim()===""){
showMessage("Enter task");
return;
}
if(category===""){
showMessage("Select category");
return;
}
try{
const newTask = {
text:task.trim(),
category:category,
repeat:repeat,
dueDate:
repeat==="Custom"
?
dueDate
:
""
};
const res = await API.post("/tasks",newTask);
setTasks(prev=>[
...prev,
res.data
]);
setNewTaskId(res.data._id);
setTimeout(()=>{
newTaskRef.current?.scrollIntoView({
behavior:"smooth",
block:"center"
});
},200);
setTimeout(()=>{
setNewTaskId(null);
},2000);
showMessage("Task Added Successfully");
setTask("");
setDueDate("");
setCategory("");
setRepeat("Daily");
}catch(err){
console.log("ADD TASK ERROR:", err);
showMessage(
  err.response?.data?.error || "Unable to add task"
);
}
}
async function deleteTasks(id){
try{
await API.delete(`/tasks/${id}`);
setTasks(prev=>
prev.filter(item=>item._id!==id)
);
setDeleteConfirmId(null);
showMessage("Task Deleted");
}catch(err){
console.log(err);
}
}
async function completeTasks(id){
try{
const res = await API.patch(`/tasks/${id}`);
setTasks(prev=>
prev.map(item=>
item._id===id
?
res.data
:
item
)
);
}catch(err){
console.log(err);
}
}
function startEdit(item){
setEditId(item._id);
setEditText(item.text);
setEditDate(item.dueDate || "");
setEditCategory(item.category || "");
setEditRepeat(item.repeat);
}
async function saveEdit(id){
try{
const res = await API.put(`/tasks/${id}`,{
text:editText,
category:editCategory,
repeat:editRepeat,
dueDate:
editRepeat==="Custom"
?
editDate
:
""
});
setTasks(prev=>
prev.map(item=>
item._id===id
?
res.data
:
item
)
);
setEditId(null);
showMessage("Task Updated");
}catch(err){
console.log(err);
}
}
function handleDragEnd(event){
const {
active,
over
}=event;
if(!over || active.id===over.id)
return;
const oldIndex = tasks.findIndex(item=>
item._id===active.id
);
const newIndex = tasks.findIndex(item=>
item._id===over.id
);
setTasks(
arrayMove(
tasks,
oldIndex,
newIndex
)
);
}
let filteredTasks = tasks.filter(item=>
item.text
.toLowerCase()
.includes(search.toLowerCase())
);
if(sortOption==="newest"){
filteredTasks.sort((a,b)=>
new Date(b.createdAt)-new Date(a.createdAt)
);
}
else if(sortOption==="oldest"){
filteredTasks.sort((a,b)=>
new Date(a.createdAt)-new Date(b.createdAt)
);
}
else if(sortOption==="due"){
filteredTasks.sort((a,b)=>{
const dateA = a.dueDate
?
new Date(a.dueDate)
:
new Date("9999-12-31");
const dateB = b.dueDate
?
new Date(b.dueDate)
:
new Date("9999-12-31");
return dateA-dateB;
});
}
else if(sortOption==="category" && categorySort){
filteredTasks = filteredTasks.filter(item=>
item.category===categorySort
);
}
return(
<div className="theme">
<main>
{
message &&
<div className="toast">
{message}
</div>
}
<div className="dashboard-header">
  <h1 className="dashboard-title">
    {loginType === "register"
      ? `Welcome, ${user.username}!`
      : `Welcome back, ${user.username}!`}
  </h1>
  <p className="dashboard-subtitle">
    Let's make today productive.
  </p>
</div>
<div className="input-section">
<input
value={task}
placeholder="Enter task"
onChange={e=>setTask(e.target.value)}
/>
<select
value={category}
onChange={e=>setCategory(e.target.value)}
>
<option value="">
Category
</option>
<option>Study</option>
<option>Work</option>
<option>Personal</option>
<option>Health</option>
</select>
<select
value={repeat}
onChange={e=>setRepeat(e.target.value)}
>
<option>Daily</option>
<option>Weekly</option>
<option>Monthly</option>
<option>Custom</option>
</select>
{
repeat==="Custom" &&
<input
type="date"
value={dueDate}
onChange={e=>setDueDate(e.target.value)}
/>
}
<button
type="button"
onClick={addTask}
>
Add Task
</button>
</div>
<div className="filter-section">
<input
placeholder="Search..."
value={search}
onChange={e=>setSearch(e.target.value)}
/>
<select
value={sortOption}
onChange={e=>setSortOption(e.target.value)}
>
<option value="default">
↑↓ Default
</option>
<option value="newest">
↑ Newest
</option>
<option value="oldest">
↓ Oldest
</option>
<option value="due">
↕ Due Date
</option>
<option value="category">
↕ Category
</option>
</select>
{
sortOption==="category" &&
<select
value={categorySort}
onChange={e=>setCategorySort(e.target.value)}
>
<option value="">
Select Category
</option>
<option>Study</option>
<option>Work</option>
<option>Personal</option>
<option>Health</option>
</select>
}
<button
type="button"
onClick={()=>{
setSearch("");
setSortOption("default");
setCategorySort("");
}}
>
Reset
</button>
</div>
<DndContext
sensors={sensors}
collisionDetection={closestCenter}
onDragEnd={handleDragEnd}
>
<SortableContext
items={tasks.map(item=>item._id)}
strategy={verticalListSortingStrategy}
>
<div className="task-list">
{
filteredTasks.length===0
?
<>
<p>📝 No tasks yet</p>
<p>Start by creating your first task.</p>
</>
:
filteredTasks.map(item=>(
<TaskCard
mode="dashboard"
key={item._id}
item={item}
editId={editId}
editText={editText}
setEditText={setEditText}
editDate={editDate}
setEditDate={setEditDate}
editCategory={editCategory}
setEditCategory={setEditCategory}
editRepeat={editRepeat}
setEditRepeat={setEditRepeat}
saveEdit={saveEdit}
startEdit={startEdit}
completeTasks={completeTasks}
deleteTasks={deleteTasks}
deleteConfirmId={deleteConfirmId}
setDeleteConfirmId={setDeleteConfirmId}
newTaskId={newTaskId}
newTaskRef={
newTaskId===item._id
?
newTaskRef
:
null
}
/>
))
}
</div>
</SortableContext>
</DndContext>
</main>
</div>
);
}
export default Dashboard;