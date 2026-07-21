import Joi from "joi";

export const connectSchema = Joi.object({
  apiKey: Joi.string().required().messages({
    "string.empty": "GitHub Personal Access Token is required",
    "any.required": "GitHub Personal Access Token is required",
  }),
});
