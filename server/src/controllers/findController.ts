import { Response, Request } from "express";
import { data } from "../../mockData/data";
import Ajv from "ajv";
import inputDataSchema from "../../schema/inputData";
import { DataItem } from "../types";

export const postFindData = (req: Request, res: Response) => {
  const ajv = new Ajv();
  const validate = ajv.compile<DataItem>(inputDataSchema);

  if (validate(req.body)) {
    res.send(...filter(req.body));
  } else {
    res.status(400).json(validate.errors);
  }
};

const filter = ({ email, number }: DataItem): DataItem[] => {
  if (email && number) {
    return data.filter(
      (user) => user.email === email && user.number === number
    );
  } else {
    return [data.find((user) => user.email === email)] as DataItem[];
  }
};
