import router, { Router } from "express";
import { createBook, getBooks, showBook, updateBook, bulkUpload } from "../responders/books.responder";
import { celebrate, Joi, Segments, errors } from "celebrate";
import multer, { Multer } from "multer";

const upload: Multer = multer({ storage: multer.memoryStorage() });
const bookRoutes: Router = router();

// Index
bookRoutes.get('/', celebrate({
  [Segments.QUERY]: Joi.object().keys({
    limit: Joi.string(),
    offset: Joi.string()
  })
}), getBooks)

// Show
bookRoutes.get('/:bookId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    bookId: Joi.string().required(),
  })
}), showBook)

// Create
bookRoutes.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required(),
    category: Joi.string().required(),
    star_rating: Joi.number().required(),
    description: Joi.string().required(),
    info: Joi.string().required()
  })
}), createBook);

// Update
bookRoutes.put('/:bookId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    bookId: Joi.string().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string(),
    category: Joi.string(),
    star_rating: Joi.number(),
    description: Joi.string(),
    info: Joi.string()
  })
}), updateBook);

// Bulk Upload
bookRoutes.post('/bulk-upload',
  upload.single('file'),
  celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    'content-type': Joi.string().required()
  }).unknown(true)
  }),
bulkUpload)

bookRoutes.use(errors());

export default bookRoutes;
