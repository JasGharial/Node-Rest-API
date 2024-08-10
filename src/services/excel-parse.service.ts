import ExcelJS, { CellValue } from "exceljs";
import Worksheet from "exceljs/index";
import { Row } from "exceljs";

import { PrismaService } from '../services/db.connection'
import { PrismaClient } from "@prisma/client"

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { BookType } from "@/types/books.type"

const prisma: PrismaClient = PrismaService.getInstance();

export const parsedExcel = async (excelToParse: Buffer): Promise<Worksheet> => {
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(excelToParse);
    return workbook.getWorksheet(1);
  } catch (error) {
    console.error('Error loading Excel file:', error);
    throw new Error('Failed to parse Excel file');
  }
}

export const getJsonFromExcel = (excelToParse: Worksheet): BookType[] => {
  const parsedJsonArray: BookType[] = [];

  excelToParse.eachRow((row: Row , rowNumber: number) => {
    if (rowNumber === 1) return;

    let valuesArray: CellValue[] = [];

    if (Array.isArray(row.values)) {
      // If row.values is an array, filter and map it directly
      valuesArray = row.values.filter(value => value !== undefined && value !== null && value !== '');
    } else {
      // If row.values is an object, convert it to an array of values
      valuesArray = Object.values(row.values).filter(value => value !== undefined && value !== null && value !== '');
    }

    const rowData: BookType = {
      title: valuesArray[0] as string,
      category: valuesArray[1] as string,
      star_rating: Number(valuesArray[2]),
      description: valuesArray[3] as string,
      image_url: valuesArray[4] as string,
      info: valuesArray[5] as string
    };

    parsedJsonArray.push(rowData);
  })

  return parsedJsonArray
}

export const createBooksBulk = async (parsedJsonData: BookType[]) => {

  try {
    // await prisma.$transaction(async (tx) => {
    //   // Create books individually within the transaction
    //   for (const bookData of parsedJsonData) {
    //     await tx.book.create({
    //       data: bookData,
    //     });
    //   }
    // });
    await prisma.$transaction(async (txn) => {
      const createdBooks = await txn.book.createMany({
        data: parsedJsonData
      })
    });
  } catch (err) {
    if(err instanceof PrismaClientKnownRequestError) {
      const { code, meta } = err;
      const failedItems = meta?.target as BookType[];

      console.error('Error occurred during book creation:');
      failedItems.forEach((item, index) => {
        console.error(`- Book index ${index}: ${JSON.stringify(item)}`);
      });

      setTimeout(() => {
        console.log("Error found in:",failedItems);
      }, 2000)

      // return { error: err, failedItems };
    } else {

      console.error('Unexpected error occurred:', err);
      throw err;
    }
  }

  // const createdBooks = await prisma.book.createMany({
  //   data: parsedJsonData
  // })
}
