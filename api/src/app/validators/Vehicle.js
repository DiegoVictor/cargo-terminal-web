import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      model: Yup.string().required(),
      type: Yup.number({ min: 1, max: 5 }).required(),
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
