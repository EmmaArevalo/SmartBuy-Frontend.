# Smart Buy — Frontend Angular

Aplicación web para consultar, crear, editar y eliminar productos,
integrada con una API REST en Node.js, Express y MongoDB.

**Aprendiz:** Emma Alexandra Arévalo Rodríguez  
**Ficha:** 3186670 — SENA  
**Evidencia:** GA8-220501096-AA1-EV01

## Tecnologías

Angular, TypeScript, HTML, CSS y RxJS.
Pruebas unitarias con Vitest.

## Requisitos

- Node.js y npm compatibles con Angular 22.
- Entorno utilizado: Node.js 24.20.0 y npm 11.19.0.
- API de Smart Buy funcionando en el puerto 3000.
- MongoDB activo y conectado con la API.

Backend:
https://github.com/EmmaArevalo/SmartBuy-API

## Instalación

```bash
git clone https://github.com/EmmaArevalo/SmartBuy-Frontend..git SmartBuy-Frontend
cd SmartBuy-Frontend
npm ci
```

## Ejecución

Primero iniciar MongoDB y ejecutar el backend siguiendo su README.

En otra terminal, dentro de la carpeta del frontend:

```bash
npm start
```

Abrir http://localhost:4200

Mantener abiertas las terminales de la API y del frontend.

## Conexión con la API

El archivo `src/app/productos.service.ts` utiliza esta dirección:

```text
http://127.0.0.1:3000/api/productos
```

El servicio realiza peticiones GET, POST, PUT y DELETE.
La API permite la comunicación entre Angular y MongoDB.

## Funciones

- Consultar el inventario y contar los productos.
- Crear productos.
- Editar productos.
- Eliminar productos con confirmación.
- Validar campos obligatorios.
- Rechazar precios negativos y cantidades de stock negativas o fraccionarias.
- Mostrar mensajes de éxito y error.
- Conservar los datos del formulario cuando falla el guardado.

Los productos antiguos sin marca se muestran como "Sin registrar".
Al editarlos se debe completar la marca.

## Organización

| Archivo | Responsabilidad |
|---|---|
| src/app/app.ts | Estado de la pantalla y gestión de productos |
| src/app/app.html | Formulario, inventario y botones |
| src/app/app.css | Diseño adaptable y colores de Smart Buy |
| src/app/app.config.ts | Configuración de proveedores |
| src/app/productos.service.ts | Tipos de producto y comunicación HTTP |
| src/app/app.spec.ts | Pruebas unitarias del componente |
| public/logo-smartbuy.png | Logo de la aplicación |

## Pruebas unitarias

```bash
npm test -- --watch=false
```

Resultado verificado: 7 pruebas aprobadas.

Se comprueba:

1. Carga de productos.
2. Creación y limpieza del formulario.
3. Rechazo de stock negativo.
4. Actualización de un producto.
5. Eliminación confirmada.
6. Cancelación de la eliminación.
7. Conservación del formulario ante un error de guardado.

Estas pruebas simulan el servicio de productos.
No realizan peticiones reales ni modifican MongoDB.

También se verificaron manualmente las operaciones CRUD desde la interfaz.

## Compilación

```bash
npm run build
```

Los archivos compilados se generan en `dist/SmartBuy-Frontend`.
La API debe estar disponible para consultar y gestionar los datos.

## Alcance

Versión académica para gestionar productos en un entorno local.
No incluye autenticación, pagos ni carrito de compras.