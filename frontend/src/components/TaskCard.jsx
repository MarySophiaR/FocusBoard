import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
function TaskCard({
item,
editId,
editText,
setEditText,
editDate,
setEditDate,
editCategory,
setEditCategory,
editRepeat,
setEditRepeat,
saveEdit,
startEdit,
completeTasks,
deleteTasks,
deleteConfirmId,
setDeleteConfirmId,
newTaskId,
newTaskRef,
mode = "dashboard"
}) {
const {
attributes,
listeners,
setNodeRef,
transform,
transition
} = useSortable({
id:item._id
});
const style = {
transform:CSS.Transform.toString(transform),
transition
};
return (
<div
ref={(node)=>{
setNodeRef(node);
if(newTaskRef){
newTaskRef.current=node;
}
}}
style={style}
className={`task-card ${
newTaskId===item._id ? "new-task" : ""
}`}
{...(mode==="dashboard" ? attributes : {})}
{...(mode==="dashboard" ? listeners : {})}
>
<div className="task-info">
{
editId===item._id ? (
<div
className="edit-box"
onPointerDown={(e)=>e.stopPropagation()}
>
<input
value={editText}
onChange={(e)=>setEditText(e.target.value)}
/>
<select
value={editCategory}
onChange={(e)=>setEditCategory(e.target.value)}
>
<option>Study</option>
<option>Work</option>
<option>Personal</option>
<option>Health</option>
</select>
<select
value={editRepeat}
onChange={(e)=>setEditRepeat(e.target.value)}
>
<option>Daily</option>
<option>Weekly</option>
<option>Monthly</option>
<option>Custom</option>
</select>
{
editRepeat==="Custom" &&
<input
type="date"
value={editDate}
onChange={(e)=>setEditDate(e.target.value)}
/>
}
</div>
)
:
<div className="task-content">
<h2 className="task-title">
<span className="task-line">
| &nbsp;
</span>
<span className={item.completed ? "done":""}>
{item.text.toUpperCase()}
</span>
</h2>
<div className="task-details">
<p
className={`badge ${
(item.category || "Study").toLowerCase()
}`}
>
{item.category || "Study"}
</p>
{
item.dueDate &&
<p>
Due: {item.dueDate}
</p>
}
{
  item.repeat &&
  item.repeat !== "Custom" && (
    <p>
      Repeat: {item.repeat}
    </p>
  )
}
</div>
</div>
}
</div>
<div
className="task-actions"
onPointerDown={(e)=>e.stopPropagation()}
>
{/* Edit */}
{
(mode==="dashboard" || mode==="all") &&
(
editId===item._id ?
<button
type="button"
onClick={() => saveEdit(item._id)}
>
Save
</button>
:
<button
type="button"
onClick={() => startEdit(item)}
>
Edit
</button>
)
}
{/* Complete */}
{
(mode==="dashboard" ||
mode==="all" ||
mode==="pending" ||
mode==="reminder")
&&
<button
type="button"
onClick={() => completeTasks(item._id)}
>
✔
</button>
}
{/* Delete */}
{
(mode==="dashboard" ||
mode==="all" ||
mode==="completed")
&&
<>
<button
onPointerDown={(e)=>e.stopPropagation()}
type="button"
onClick={() => setDeleteConfirmId(item._id)}
>
🗑
</button>
{
deleteConfirmId===item._id &&
<div
className="delete-confirm"
onPointerDown={(e)=>e.stopPropagation()}
>
<p>
Delete this task?
</p>
<div className="delete-buttons">
<button
type="button"
onClick={() => deleteTasks(item._id)}
>
Confirm
</button>
<button
type="button"
onClick={() => setDeleteConfirmId(null)}
>
Cancel
</button>
</div>
</div>
}
</>
}
</div>
</div>
);
}
export default TaskCard;