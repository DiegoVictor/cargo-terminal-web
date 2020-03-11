import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      vehicle_id: Yup.string().required(),
      driver_id: Yup.string().required(),
      origin: Yup.object()
        .shape({
          latitude: Yup.number().required(),
          longitude: Yup.number().required(),
        })
        .required(),
      destination: Yup.object()
        .shape({
          latitude: Yup.number().required(),
          longitude: Yup.number().required(),
        })
        .required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res.status(400).json({
      error: {
        message: 'Validation fails',
        details: err.inner,
      },
    });
  }
};
