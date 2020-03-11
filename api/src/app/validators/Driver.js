import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      cpf: Yup.string().required(),
      name: Yup.string().required(),
      phone: Yup.string().required(),
      birthday: Yup.string().required(),
      gender: Yup.string().required(),
      cnh_number: Yup.string().required(),
      cnh_type: Yup.string().required(),
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
