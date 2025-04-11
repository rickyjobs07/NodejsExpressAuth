const express = require('express');
const authController = require('../controllers/authController');
const { identifier } = require('../middlewares/identification');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rutas de autenticación de usuarios
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/signup', authController.signup);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/signin', authController.signin);

/**
 * @swagger
 * /auth/signout:
 *   post:
 *     summary: Cierra sesión del usuario
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *       401:
 *         description: No autorizado
 */
router.post('/signout', identifier, authController.signout);

/**
 * @swagger
 * /auth/send-verification-code:
 *   patch:
 *     summary: Envía un código de verificación al usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Código enviado correctamente
 *       401:
 *         description: No autorizado
 */
router.patch('/send-verification-code', authController.sendVerificationCode);

/**
 * @swagger
 * /auth/verify-verification-code:
 *   patch:
 *     summary: Verifica el código de verificación enviado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Código verificado correctamente
 *       400:
 *         description: Código inválido o expirado
 *       401:
 *         description: No autorizado
 */
router.patch('/verify-verification-code', identifier, authController.verifyVerificationCode);

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     summary: Cambia la contraseña del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: "nuevoPassword123"
 *     responses:
 *       200:
 *         description: Contraseña cambiada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.patch('/change-password', identifier, authController.changePassword);

/**
 * @swagger
 * /auth/send-forgot-password-code:
 *   patch:
 *     summary: Envía un código de verificación para recuperar la contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *     responses:
 *       200:
 *         description: Código de recuperación enviado
 *       400:
 *         description: Email inválido
 */
router.patch('/send-forgot-password-code', authController.sendForgotPasswordCode);

/**
 * @swagger
 * /auth/verify-forgot-password-code:
 *   patch:
 *     summary: Verifica el código de recuperación y permite establecer nueva contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: "nuevaClaveSegura123"
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *       400:
 *         description: Código inválido o expirado
 */
router.patch('/verify-forgot-password-code', authController.verifyForgotPasswordCode);


module.exports = router;