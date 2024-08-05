import { Request, Response } from "express";

export const getUsers = (request: Request, response: Response) => {
    response.send([{"message": "This is Index Page"}])
}
