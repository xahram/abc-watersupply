const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age : {
        type: Number,
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Utility"
    }
})


module.exports = mongoose.model("User",userSchema);