import mongoose from 'mongoose'
const { Schema } = mongoose

const registrationSchema = new Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['student','admin'], default: 'student' }
}, { timestamps: true })

export default mongoose.model('Registration', registrationSchema)
