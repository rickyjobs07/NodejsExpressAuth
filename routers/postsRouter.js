const express = require('express');
const postsController = require('../controllers/postsController');
const { identifier } = require('../middlewares/identification');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Endpoints para gestionar publicaciones
 */

/**
 * @swagger
 * /posts/all-posts:
 *   get:
 *     summary: Obtener todas las publicaciones
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de publicaciones obtenida correctamente
 */
router.get('/all-posts', postsController.getPosts);

/**
 * @swagger
 * /posts/single-post:
 *   get:
 *     summary: Obtener una publicación específica
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación obtenida correctamente
 */
router.get('/single-post', postsController.singlePost);

/**
 * @swagger
 * /posts/create-post:
 *   post:
 *     summary: Crear una nueva publicación
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Publicación creada correctamente
 */
router.post('/create-post', identifier, postsController.createPost);

/**
 * @swagger
 * /posts/update-post:
 *   put:
 *     summary: Actualizar una publicación existente
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               titulo:
 *                 type: string
 *               contenido:
 *                 type: string
 *     responses:
 *       200:
 *         description: Publicación actualizada correctamente
 */
router.put('/update-post', identifier, postsController.updatePost);

/**
 * @swagger
 * /posts/delete-post:
 *   delete:
 *     summary: Eliminar una publicación
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la publicación a eliminar
 *     responses:
 *       200:
 *         description: Publicación eliminada correctamente
 */
router.delete('/delete-post', postsController.deletePost);


module.exports = router;