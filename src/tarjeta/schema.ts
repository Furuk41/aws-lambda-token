import * as Joi from "joi";

interface IParamSchema {
  token: string;
}

export const paramSchema = Joi.object<IParamSchema>({
  token: Joi.string().required().max(16),
});
