import mongoose from 'mongoose'
const { Schema } = mongoose

const adminSchema = new Schema({
  mail: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true })

export default mongoose.model('Admin', adminSchema)
