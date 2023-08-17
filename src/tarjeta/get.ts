import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyResult,
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { headerSchema } from "../header/schema";
import { paramSchema } from "./schema";
import { compareDates } from "../utils/compareDates";

export const get = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const authorization = event.headers["Authorization"];
  const dynamoDb = new DynamoDB.DocumentClient();
  const { token } = event.pathParameters as APIGatewayProxyEventPathParameters;

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

  // validate param

  const { value: valueParam, error: errorParam } = paramSchema.validate({
    token,
  });

  if (errorParam) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: errorParam.details[0].message,
      }),
    };
  }

  // obtener datos de tarjeta

  const result = await dynamoDb
    .scan({
      TableName: "TokenTable",
      FilterExpression: "#token = :token",
      ExpressionAttributeValues: {
        ":token": valueParam.token,
      },
      ProjectionExpression:
        "card_number, expiration_month, expiration_year, email, createdAt",
      ExpressionAttributeNames: {
        "#token": "token",
      },
    })
    .promise();

  if (result.Items == undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "No se pudo encontrar datos de tarjeta o su token no es valido",
      }),
    };
  }

  const tarjeta = result.Items[0];
  const tarjetaDate = new Date(tarjeta.createdAt);
  const now = new Date();

  // validar token

  const isValidToken = compareDates(tarjetaDate, now, 15);

  if (!isValidToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "Su token esta vencido, vuelva a generar una nuevo.",
      }),
    };
  }

  delete tarjeta.createdAt;

  return {
    statusCode: 200,
    body: JSON.stringify({ tarjeta }),
  };
};
