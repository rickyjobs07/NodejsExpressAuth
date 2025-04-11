# 📝 API de Posts con Node.js, Express y MongoDB

Este proyecto es una API RESTful para la gestión de publicaciones (posts), creada con Node.js, Express y MongoDB. Permite operaciones CRUD y está lista para ser desplegada en Render.

https://nodejsexpressauthapi.onrender.com/api/api-docs/

## 🚀 Endpoints

| Método | Endpoint              | Descripción                     | Autenticación |
|--------|------------------------|----------------------------------|----------------|
| GET    | `/api/posts/all-posts`    | Obtener todos los posts         | ❌ No requerida |
| GET    | `/api/posts/single-post?id=<postId>` | Obtener un solo post por ID | ❌ No requerida |
| POST   | `/api/posts/create-post`  | Crear un nuevo post             | ✅ Requerida    |
| PUT    | `/api/posts/update-post`  | Actualizar un post              | ✅ Requerida    |
| DELETE | `/api/posts/delete-post?id=<postId>` | Eliminar un post           | ❌ No requerida |

---

## 📦 Instalación

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
npm install

👨‍💻 Autor
Ricky Montero Terrero
💼 Ingeniero de Software
🌍 República Dominicana
📧 rickymonterojobs07@gmail.com
