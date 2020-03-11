import { model, Schema } from 'mongoose';

export default model(
  'Arrival',
  new Schema(
    {
      filled: {
        type: Boolean,
        default: false,
      },
      driver: {
        type: Schema.Types.ObjectId,
        ref: 'Driver',
      },
      vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
      },
      origin: [Number],
      destination: [Number],
    },
    { timestamps: true }
  )
);
