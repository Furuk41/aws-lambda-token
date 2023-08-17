import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { bodySchema } from "./schema";
import { headerSchema } from "../header/schema";
import { generateUniqueToken } from "../utils/generateToken";
import { v4 } from "uuid";
import { DynamoDB } from "aws-sdk";

export const create = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const body = JSON.parse(event.body || "");
  const authorization = event.headers["Authorization"];
  const dynamoDb = new DynamoDB.DocumentClient();

  // validate header

  const { value: valueHeader, error: errorHeader } =
    headerSchema.validate(authorization);

  if (errorHeader) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: errorHeader.details[0].message,
      }),
    };
  }

  // validate body

  const { value: valueBody, error: errorBody } = bodySchema.validate(body);

  if (errorBody) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: errorBody.details[0].message,
      }),
    };
  }

  // create token

  const token = generateUniqueToken(16);
  const id = v4();
  const createdAt = new Date().toISOString();

  const newItemTable = {
    id,
    ...valueHeader,
    ...valueBody,
    token,
    createdAt,
  };

  await dynamoDb
    .put({
      TableName: "TokenTable",
      Item: newItemTable,
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ token }),
  };
};
