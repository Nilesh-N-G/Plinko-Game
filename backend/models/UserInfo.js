import mongoose from 'mongoose';

const UserInfoSchema = new mongoose.Schema({
  email: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  balance: { type: Number, required: true },
});


const UserInfo = mongoose.model('UserInfo', UserInfoSchema);

export default UserInfo;