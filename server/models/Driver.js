import mongoose from 'mongoose'
const { Schema } = mongoose

const driverSchema = new Schema({
  id:    { type: String, required: true, unique: true }, // external driver id
  photo: { type: String }, // URL/base64 optional
  name:  { type: String, required: true },
  phone: { type: String, required: true },
  busno: { type: String, required: true },
  route: { type: String, required: true }
}, { timestamps: true })

export default mongoose.model('Driver', driverSchema)
