import * as Joi from "joi";

interface IHeaderSchema {
  authorization: string;
}

export const headerSchema = Joi.object<IHeaderSchema>({
  authorization: Joi.string()
    .required()
    .max(100)
    .custom((value: string, helper) => {
      if (value.startsWith("Bearer pk_")) {
        return value;
      } else {
        throw new Error(`Llave del comercio no valido`);
      }
    }),
});
