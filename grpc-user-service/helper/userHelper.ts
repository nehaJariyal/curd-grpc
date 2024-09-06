// import database from '../models/index';
// import { sendEmail } from './emailHelper';
// import * as grpc from '@grpc/grpc-js';

// // gRPC handler for creating a user
// export async function createUser(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
//   const userRequest = call.request;

//   if (!userRequest.username || !userRequest.password) {
//     return callback({
//       code: grpc.status.INVALID_ARGUMENT,
//       message: 'Invalid username or password',
//     }, null);
//   }

//   try {
//     const user = await database.userModel.create(userRequest);
    
//     // Send email notification
//     await sendEmail({
//       to: 'example@example.com',
//       subject: 'New User Registered',
//       text: `${userRequest.username}, thank you for registering.`,
//     });

//     const responseData = {
//       status: 'success',
//       message: 'User created successfully and email sent',
//       data: { username: user.username },
//     };

//     console.log('User created:', user);
//     callback(null, responseData);
//   } catch (error) {
//     console.error('Error creating user:', error);
//     return callback({
//       code: grpc.status.INTERNAL,
//       details: 'Error saving user data',
//     }, null);
//   }
// }

// // gRPC handler for reading a user
// export async function readUser(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
//   const userId = call.request.id;

//   try {
//     const user = await database.userModel.findByPk(userId);

//     if (!user) {
//       return callback({
//         code: grpc.status.NOT_FOUND,
//         message: 'User not found',
//       }, null);
//     }

//     callback(null, user);
//   } catch (error) {
//     console.error('Error reading user:', error);
//     return callback({
//       code: grpc.status.INTERNAL,
//       details: 'Error reading user data',
//     }, null);
//   }
// }

// // gRPC handler for updating a user
// export async function updateUser(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
//   const userId = call.request.id;
//   const updatedData = call.request;

//   try {
//     const user = await database.userModel.findByPk(userId);

//     if (!user) {
//       return callback({
//         code: grpc.status.NOT_FOUND,
//         message: 'User not found',
//       }, null);
//     }

//     const updatedUser = await user.update(updatedData);
//     console.log('User updated:', updatedUser);
//     callback(null, updatedUser);
//   } catch (error) {
//     console.error('Error updating user:', error);
//     return callback({
//       code: grpc.status.INTERNAL,
//       details: 'Error updating user data',
//     }, null);
//   }
// }

// // gRPC handler for deleting a user
// export async function deleteUser(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
//   const userId = call.request.id;

//   try {
//     const user = await database.userModel.findByPk(userId);

//     if (!user) {
//       return callback({
//         code: grpc.status.NOT_FOUND,
//         message: 'User not found',
//       }, null);
//     }

//     console.log('User deleted:', user);
//     await user.destroy();
//     callback(null, { message: 'User deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     return callback({
//       code: grpc.status.INTERNAL,
//       details: 'Error deleting user data',
//     }, null);
//   }
// }









