import mongoose from "mongoose";
const taskSchema = new mongoose.Schema(
{
text: {
type:String,
required:true
},
completed: {
type:Boolean,
default:false
},
dueDate: {
type:String
},
category: {
type:String,
default:"Study"
},
repeat: {
type:String,
default:"Daily",
enum:[
"Daily",
"Weekly",
"Monthly",
"Custom"
]
},
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
}
},
{
timestamps:true
}
);
export default mongoose.model("Task", taskSchema);