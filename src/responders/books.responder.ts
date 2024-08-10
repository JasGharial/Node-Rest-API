import { Request, Response } from 'express-serve-static-core'
import { PrismaService } from '../services/db.connection'
import { PrismaClient, Book } from "@prisma/client"
import { getJsonFromExcel, parsedExcel, createBooksBulk } from "../services/excel-parse.service";

const prisma: PrismaClient = PrismaService.getInstance();

type CreateBookInput  = Omit<Book, "id" | "createdAt" | "updatedAt">

// Index
export const getBooks = async (request: Request, response: Response) => {
  const { limit, offset } = request.query;

  const skipRecords: number = Number(limit) * Number(offset)

  const books = await prisma.book.findMany({
    skip: skipRecords,
    take: Number(limit)
  });

  response.send(books);
}

// Create
export const createBook = async (request: Request, response: Response) => {
    const bookData: CreateBookInput = request.body;
    const book = await prisma.book.create({data: bookData});

    response.send(book);
}

// Show
export const showBook = async (request: Request, response: Response) => {
    const { bookId } = request.params
    const book = await prisma.book.findUnique({where: {id: parseInt(bookId)}});

    response.send(book);
}

// Update
export const updateBook = async (request: Request, response: Response) => {
    const { bookId } = request.params;
    const bookData = request.body;
    const updatedBook = await prisma.book.update({
        where: {id: parseInt(bookId)}, data: bookData
    });

    response.status(200).send(updatedBook);
}

// Bulk Upload
export const bulkUpload = async (request: Request, response: Response) => {
    const fileUploaded: Express.Multer.File | undefined = request.file;

    if (!fileUploaded || !fileUploaded.buffer) {
        return response.status(400).send('No file uploaded or file is empty');
    }

    const parsedWorkbook = await parsedExcel(fileUploaded.buffer);
    const parsedJsonData = getJsonFromExcel(parsedWorkbook);
    const booksCreated = createBooksBulk(parsedJsonData);

    response.status(200).json(booksCreated);
}
