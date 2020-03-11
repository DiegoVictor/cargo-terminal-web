import { model, Schema } from 'mongoose';

export default model(
  'Vehicle',
  new Schema({
    model: String,
    type: Number,
  })
);
