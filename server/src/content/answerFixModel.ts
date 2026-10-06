import { model, Schema } from "mongoose";

const answerFixSchema = new Schema(
  {
    itemId: { type: String, required: true, unique: true, index: true },
    answer: { type: String, required: true },
  },
  { timestamps: true },
);

export const AnswerFixModel = model("AnswerFix", answerFixSchema);
