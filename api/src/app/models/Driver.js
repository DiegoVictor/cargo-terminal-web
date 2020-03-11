import { model, Schema } from 'mongoose';

export default model(
  'Driver',
  new Schema({
    cpf: String,
    name: String,
    phone: String,
    birthday: String,
    gender: String,
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    cnh_number: String,
    cnh_type: String,
    active: {
      type: Boolean,
      default: true,
    },
  })
);
