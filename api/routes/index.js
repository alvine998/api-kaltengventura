const { middlewareHere } = require("../middleware/index.js");
const uploadFile = require("../middleware/upload.js");

module.exports = (app) => {
  const cUser = require("../controllers/user.js");
  const cBank = require("../controllers/bank.js");
  const cDebtor = require("../controllers/debtor.js");
  const cApplication = require("../controllers/application.js");
  const cUpload = require("../controllers/upload.js");
  const cPayment = require("../controllers/payment.js");
  const cNotification = require("../controllers/notification.js");

  /**
   * @swagger
   * /user/list:
   *   get:
   *     summary: Retrieve a list of users
   *     tags: [User]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *         description: Number of items per page
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search by name, phone, or email
   *     responses:
   *       200:
   *         description: A list of users
   */
  app.get("/user/list", middlewareHere, cUser.list);

  /**
   * @swagger
   * /user:
   *   post:
   *     summary: Create a new user
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - phone
   *               - email
   *               - status
   *               - password
   *             properties:
   *               name:
   *                 type: string
   *               phone:
   *                 type: string
   *               email:
   *                 type: string
   *               status:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: User created successfully
   *       400:
   *         description: Missing parameters or user already exists
   */
  app.post("/user", middlewareHere, cUser.create);

  /**
   * @swagger
   * /user/login:
   *   post:
   *     summary: User login
   *     tags: [User]
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
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *       404:
   *         description: User not found or wrong password
   */
  app.post("/user/login", middlewareHere, cUser.login);

  /**
   * @swagger
   * /user:
   *   patch:
   *     summary: Update a user
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id
   *             properties:
   *               id:
   *                 type: integer
   *               name:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: User updated successfully
   *       404:
   *         description: User not found
   */
  app.patch("/user", middlewareHere, cUser.update);

  /**
   * @swagger
   * /user:
   *   delete:
   *     summary: Delete a user (soft delete)
   *     tags: [User]
   *     parameters:
   *       - in: query
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: User ID
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       404:
   *         description: User not found
   */
  app.delete("/user", middlewareHere, cUser.delete);

  /**
   * @swagger
   * /bank/list:
   *   get:
   *     summary: Retrieve a list of banks
   *     tags: [Bank]
   *     parameters:
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *         description: Number of items to retrieve
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search by account name or number
   *     responses:
   *       200:
   *         description: A list of banks
   */
  app.get("/bank/list", middlewareHere, cBank.list);

  /**
   * @swagger
   * /bank:
   *   post:
   *     summary: Create a new bank
   *     tags: [Bank]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - account_name
   *               - account_number
   *               - status
   *             properties:
   *               name:
   *                 type: string
   *               account_name:
   *                 type: string
   *               account_number:
   *                 type: string
   *               status:
   *                 type: string
   *     responses:
   *       200:
   *         description: Bank created successfully
   *       400:
   *         description: Missing parameters or bank already exists
   */
  app.post("/bank", middlewareHere, cBank.create);

  /**
   * @swagger
   * /bank:
   *   patch:
   *     summary: Update a bank
   *     tags: [Bank]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id
   *             properties:
   *               id:
   *                 type: integer
   *               name:
   *                 type: string
   *               account_name:
   *                 type: string
   *               account_number:
   *                 type: string
   *               status:
   *                 type: string
   *     responses:
   *       200:
   *         description: Bank updated successfully
   *       404:
   *         description: Bank not found
   */
  app.patch("/bank", middlewareHere, cBank.update);

  /**
   * @swagger
   * /bank:
   *   delete:
   *     summary: Delete a bank (soft delete)
   *     tags: [Bank]
   *     parameters:
   *       - in: query
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: Bank ID
   *     responses:
   *       200:
   *         description: Bank deleted successfully
   *       404:
   *         description: Bank not found
   */
  app.delete("/bank", middlewareHere, cBank.delete);

  /**
   * @swagger
   * /debtor/list:
   *   get:
   *     summary: Retrieve a list of debtors
   *     tags: [Debtor]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A list of debtors
   */
  app.get("/debtor/list", middlewareHere, cDebtor.list);

  /**
   * @swagger
   * /debtor:
   *   post:
   *     summary: Create a new debtor
   *     tags: [Debtor]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - address
   *               - field_type
   *               - place_status
   *               - mother_name
   *               - ktp
   *               - kk
   *             properties:
   *               name:
   *                 type: string
   *               address:
   *                 type: string
   *               field_type:
   *                 type: string
   *               place_status:
   *                 type: string
   *               mother_name:
   *                 type: string
   *               ktp:
   *                 type: string
   *                 description: Base64 image data
   *               kk:
   *                 type: string
   *                 description: Base64 image data
   *               partner_ktp:
   *                 type: string
   *                 description: Base64 image data (optional)
   *     responses:
   *       200:
   *         description: Debtor created successfully
   *       400:
   *         description: Missing parameters
   */
  app.post("/debtor", middlewareHere, cDebtor.create);

  /**
   * @swagger
   * /debtor:
   *   patch:
   *     summary: Update a debtor
   *     tags: [Debtor]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id
   *             properties:
   *               id:
   *                 type: integer
   *               name:
   *                 type: string
   *     responses:
   *       200:
   *         description: Debtor updated successfully
   *       404:
   *         description: Debtor not found
   */
  app.patch("/debtor", middlewareHere, cDebtor.update);

  /**
   * @swagger
   * /debtor:
   *   delete:
   *     summary: Delete a debtor (soft delete)
   *     tags: [Debtor]
   *     parameters:
   *       - in: query
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *     responses:
   *       200:
   *         description: Debtor deleted successfully
   *       404:
   *         description: Debtor not found
   */
  app.delete("/debtor", middlewareHere, cDebtor.delete);

  /**
   * @swagger
   * /debtor/upload:
   *   post:
   *     summary: Upload debtor image (Base64)
   *     tags: [Debtor]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - base64Data
   *             properties:
   *               base64Data:
   *                 type: string
   *                 description: Base64 encoded image string
   *     responses:
   *       200:
   *         description: Image uploaded successfully
   */
  app.post("/debtor/upload", middlewareHere, cDebtor.uploadImage);

  /**
   * @swagger
   * /application/list:
   *   get:
   *     summary: Retrieve a list of applications
   *     tags: [Application]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search by contract number
   *     responses:
   *       200:
   *         description: A list of applications
   */
  app.get("/application/list", middlewareHere, cApplication.list);

  /**
   * @swagger
   * /application:
   *   post:
   *     summary: Create a new application
   *     tags: [Application]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - user_id
   *               - user_name
   *               - loan
   *               - year
   *               - installment
   *             properties:
   *               user_id:
   *                 type: integer
   *               user_name:
   *                 type: string
   *               loan:
   *                 type: integer
   *               year:
   *                 type: integer
   *               installment:
   *                 type: integer
   *               user_from:
   *                 type: string
   *                 description: admin to auto-generate payments
   *               start_date:
   *                 type: string
   *                 format: date
   *               status:
   *                 type: string
   *     responses:
   *       200:
   *         description: Application created successfully
   *       400:
   *         description: Missing parameters or user not found
   *   patch:
   *     summary: Update an application
   *     tags: [Application]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id
   *             properties:
   *               id:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Application updated successfully
   *       404:
   *         description: Application not found
   *   delete:
   *     summary: Delete an application (soft delete)
   *     tags: [Application]
   *     parameters:
   *       - in: query
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *     responses:
   *       200:
   *         description: Application deleted successfully
   *       404:
   *         description: Application not found
   */
  app.post("/application", middlewareHere, cApplication.create);

  /**
   * @swagger
   * /application/approval:
   *   post:
   *     summary: Approve or reject an application
   *     tags: [Application]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id
   *               - status
   *             properties:
   *               id:
   *                 type: integer
   *               status:
   *                 type: string
   *                 enum: [approved, rejected]
   *               admin:
   *                 type: object
   *                 properties:
   *                   name:
   *                     type: string
   *                   id:
   *                     type: integer
   *     responses:
   *       200:
   *         description: Application status updated
   *       404:
   *         description: Application not found
   */
  app.post("/application/approval", middlewareHere, cApplication.approval);

  app.patch("/application", middlewareHere, cApplication.update);

  app.delete("/application", middlewareHere, cApplication.delete);

  /**
   * @swagger
   * /payment/list:
   *   get:
   *     summary: Retrieve a list of payments
   *     tags: [Payment]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search by contract number or user name
   *     responses:
   *       200:
   *         description: A list of payments
   */
  app.get("/payment/list", middlewareHere, cPayment.list);

  /**
   * @swagger
   * /payment:
   *   patch:
   *     summary: Update a payment
   *     tags: [Payment]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id
   *             properties:
   *               id:
   *                 type: integer
   *               photo:
   *                 type: string
   *                 description: Base64 image data
   *     responses:
   *       200:
   *         description: Payment updated successfully
   *       404:
   *         description: Payment not found
   */
  app.patch("/payment", middlewareHere, cPayment.update);

  /**
   * @swagger
   * /image/upload:
   *   post:
   *     summary: Upload an image file
   *     tags: [Upload]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: The image file to upload
   *     responses:
   *       200:
   *         description: File uploaded successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 url:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                     url:
   *                       type: string
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                 message:
   *                   type: string
   *                   example: File Success Uploaded
   *       400:
   *         description: Bad Request
   *       500:
   *         description: Server Error
   */
  app.post("/image/upload", uploadFile.single("file"), cUpload.uploadFiles);

  /**
   * @swagger
   * /notification/list:
   *   get:
   *     summary: Retrieve a list of notifications
   *     tags: [Notification]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *       - in: query
   *         name: user_id
   *         schema:
   *           type: integer
   *       - in: query
   *         name: is_read
   *         schema:
   *           type: integer
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A list of notifications
   */
  app.get("/notification/list", middlewareHere, cNotification.list);

  /**
   * @swagger
   * /notification:
   *   post:
   *     summary: Create a new notification
   *     tags: [Notification]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - user_id
   *               - title
   *               - message
   *             properties:
   *               user_id:
   *                 type: integer
   *               title:
   *                 type: string
   *               message:
   *                 type: string
   *               type:
   *                 type: string
   *     responses:
   *       200:
   *         description: Notification created successfully
   */
  app.post("/notification", middlewareHere, cNotification.create);

  /**
   * @swagger
   * /notification:
   *   patch:
   *     summary: Update a notification
   *     tags: [Notification]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id
   *             properties:
   *               id:
   *                 type: integer
   *               title:
   *                 type: string
   *               message:
   *                 type: string
   *               is_read:
   *                 type: integer
   *               type:
   *                 type: string
   *     responses:
   *       200:
   *         description: Notification updated successfully
   */
  app.patch("/notification", middlewareHere, cNotification.update);

  /**
   * @swagger
   * /notification:
   *   delete:
   *     summary: Delete a notification
   *     tags: [Notification]
   *     parameters:
   *       - in: query
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *     responses:
   *       200:
   *         description: Notification deleted successfully
   */
  app.delete("/notification", middlewareHere, cNotification.delete);
};
