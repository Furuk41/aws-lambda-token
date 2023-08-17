import * as Joi from "joi";

interface ICreditCard {
  card_number: number;
  cvv?: number;
  expiration_month: string;
  expiration_year: string;
  email: string;
}

export const bodySchema = Joi.object<ICreditCard>({
  card_number: Joi.string()
    .regex(/^\d+$/)
    .creditCard()
    .required()
    .custom((value, helper) => {
      return parseInt(value);
    }),
  cvv: Joi.string()
    .regex(/^\d+$/)
    .min(3)
    .max(4)
    .required()
    .custom((value, helper) => {
      return parseInt(value);
    }),
  expiration_month: Joi.number().min(1).max(12).required().cast("string"),
  expiration_year: Joi.string()
    .regex(/^\d+$/)
    .length(4)
    .required()
    .custom((value: string, helper) => {
      let valueNumber: number = parseInt(value);
      let currentYear: number = new Date().getFullYear();
      let maxYear: number = currentYear + 5;
      if (valueNumber > maxYear) {
        throw new Error(`Debe ser menor al maximo año: ${maxYear}`);
      }
      return value;
    }),
  email: Joi.string()
    .email()
    .min(5)
    .max(100)
    .custom((value: string, helpers) => {
      if (
        value.endsWith("@gmail.com") ||
        value.endsWith("hotmail.com") ||
        value.endsWith("yahoo.es")
      ) {
        return value;
      } else {
        throw new Error(
          `Solo estan permitido los siguientes dominios: gmail.com, hotmail.com y yahoo.es`
        );
      }
    }),
});
